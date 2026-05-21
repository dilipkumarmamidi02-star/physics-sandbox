import fs from 'fs'

const folders = [
  'class11',
  'class12',
  'btech'
]

for (const folder of folders) {

  for (let i = 1; i <= 365; i++) {

    const content = `
export const QUESTIONS = [
  {
    id: 1,
    q: 'Sample question day ${i}?',
    opts: [
      'Option A',
      'Option B',
      'Option C',
      'Option D'
    ],
    ans: 0,
    exp: 'Explanation here.'
  }
]
`

    fs.writeFileSync(
      \`src/data/\${folder}/day\${i}.js\`,
      content
    )
  }
}

console.log(
  '365 quiz files generated.'
)
