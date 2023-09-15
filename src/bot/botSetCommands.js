export default async bot => {
  bot.setMyCommands([
    { command: '/info', description: 'Returns Trust Level and Trust Score explanation' },
    { command: '/help', description: 'Returns Bot Commands' },
  ])
}