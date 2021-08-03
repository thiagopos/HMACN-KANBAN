const puppeteer = require('puppeteer')
const login = require('./data/password.json')
const clinicas = require('./data/clinicas.json')
const URL = require('./data/urls.json')
const readline = require('readline')
const { DateTime } = require('luxon')

const scrapper = async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 30 })
  const page = await browser.newPage()
  await page.goto(URL.principal, { timeout: 60000, waitUntil: 'networkidle2' })

  await page.waitForSelector('#username\\:username')
  await page.type('#username\\:username', login.username)
  await page.type('#password\\:password', login.password)
  await page.click('#submit')

  let internados = []

  for (const c of clinicas) {
    await page.goto(URL.selecaoClinica, {
      delay: 500,
      timeout: 60000,
      waitUntil: 'networkidle2',
    })
    await page.waitForSelector('#unidadeFuncionalDecorate\\:unidadeFuncional')
    await page.type('#unidadeFuncionalDecorate\\:unidadeFuncional', c.codigo)
    await page.click('#bt_pesquisar')

    //<<experimental>> scrape everything!!!
    await page
      .waitForSelector('#tabelaPainelHospitalar', { timeout: 2000 })
      .then(async () => {
        let el = await getElementId(page)
        let aux = []
        let aux2 = []

        while (el.classe.length === 39) {
          if (aux.length === 0) {
            await page.waitForSelector('#tabelaPainelHospitalar')
            aux = await scrapTable(page)
          }
          await page.waitForSelector(`#${el.id}`)
          await page.click(`#${el.id}`)
          await page.waitForSelector('#tabelaPainelHospitalar')
          //await page.waitForTimeout(3000)
          aux2 = await scrapTable(page)
          aux = aux.concat(aux2)
          el = await getElementId(page)
        }

        if (aux.length === 0) {
          internados.push(await scrapTable(page))
        } else {
          internados.push(aux)
        }
        return internados
      })
      .catch((err) => {
        internados.push(null)
      })

    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(
      `Realizando scrap em ${c.clinica}, ${clinicas.indexOf(c) + 1} de 23.`
    )
  }

  await browser.close()
  return internados
}

const getElementId = async (page) => {
  const result = await page.evaluate(() => {
    let el = document.querySelector('#j_id165')
    if (el === null) el = document.querySelector('#j_id96')
    return { classe: el.className, id: el.id }
  })

  return result
}

const scrapTable = async (page) => {
  return await page
    .evaluate(() => {
      const table = Array.from(
        document.querySelectorAll(
          'table[id="tabelaPainelHospitalar"] > tbody > tr '
        )
      )
      return table.map((td) => td.innerText.split('\t'))
    })
    .catch((err) => null)
}

const formatter = async (internados) => {
  let kanban = []
  let acc = 0

  try {
    for (let clin of internados) {
      if (clin !== null) {
        for (let pct of clin) {
          kanban.push({
            cod: clinicas[acc].codigo,
            leito: pct[0],
            nome: pct[1],
            prontuario: pct[2],
            genero: pct[3],
            idade: pct[4],
            hd: pct[5],
            esp: pct[6],
            di: pct[7],
            du: pct[8],
            status: pct[9].toUpperCase(),            
            observacao: pct[10].split('\n').join(''),
          })
        }
      } else {
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        console.log(`${clinicas[acc].clinica} sem internações.`)
      }
      acc++
    }
    kanban.shift()
    return kanban
  } catch (err) {
    return null
  }
}

module.exports = { scrapper, formatter }

