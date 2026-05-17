const { onRequest } = require("firebase-functions/v2/https")
const { RtcTokenBuilder, RtcRole } = require("agora-token")

const APP_ID = "f6bd677bb8f74e608d189276eede3aba"
const APP_CERT = "2c93709e3e394dc5b2c250609701f8ef"

exports.agoraToken = onRequest({ cors: true }, (req, res) => {
  const channel = req.query.channel
  if (!channel) return res.status(400).json({ error: "channel required" })

  const uid = 0
  const expiry = Math.floor(Date.now() / 1000) + 3600 // 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, APP_CERT, channel, uid,
    RtcRole.PUBLISHER, expiry, expiry
  )

  res.json({ token })
})
