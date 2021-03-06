const cache = {}

function getAudioContext (options) {
  if (typeof window === 'undefined') return null

  const OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
  const Context = window.AudioContext || window.webkitAudioContext

  if (!Context) return null

  if (typeof options === 'number') {
    options = {sampleRate: options}
  }

  const sampleRate = options && options.sampleRate


  if (options && options.offline) {
    if (!OfflineContext) return null

    return new OfflineContext(options.channels || 2, options.length, sampleRate || 44100)
  }


  //cache by sampleRate, rather strong guess
  let ctx = cache[sampleRate]

  if (ctx) return ctx

  //several versions of firefox have issues with the
  //constructor argument
  //see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475
  try {
    ctx = new Context(options)
  }
  catch (err) {
    ctx = new Context()
  }
  cache[ctx.sampleRate] = cache[sampleRate] = ctx

  return ctx
}
