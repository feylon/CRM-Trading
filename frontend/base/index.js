let url = import.meta.env.VITE_API_URL || '/'
if(!url.endsWith('/')) url = url + '/'

export default url
