import amplitude from 'amplitude-js'

export const useAmplitude = () => {
  const amplitudeCode = useRuntimeConfig().public.amplitudeCode
  const amplitudeClient = amplitudeCode ? amplitude.getInstance() : null;
  if (amplitudeClient) {
    amplitudeClient.init(amplitudeCode)
  }

  const logEvent = function (eventName, eventData) {
    if (!config.production || !amplitudeClient) {
      console.log('[DEBUG] Amplitude logged event:', eventName, eventData)
    }

    if (eventData && typeof eventData !== 'object') {
      throw new Error('Amplitude event value must be an object.')
    }

    amplitudeClient.logEvent(eventName, eventData)
  }

  const setUser = function (user) {
    if (!amplitudeClient) return
    amplitudeClient.setUserId(user.id)
    amplitudeClient.setUserProperties({
      email: user.email,
      subscribed: user.is_subscribed,
      enterprise_subscription: user.has_enterprise_subscription
    })
  }


  return {
    logEvent,
    setUser,
    amplitude: amplitudeClient
  }
}
