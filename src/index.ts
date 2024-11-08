export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		console.log(url.pathname)
		if(url.pathname == "/") {
			return new Response("JB Stepan URL Shortener")
		} else if(url.pathname == "/create" && request.method == "POST") {
			const auth = request.headers.get("Auth")

			if(auth == null || auth != env.APIKEY) {
				return new Response("Unauthorized", { status: 401 })
			}

			return new Response("Good")
		} else {
			const url = new URL(request.url);
			const slug = url.pathname.slice(1);

			const cache = caches.default;
   			let cacheKey = new Request(request.url);

			let cachedResponse = await cache.match(cacheKey);
			if (cachedResponse) {
				return cachedResponse; 
			}

			const redirectUrl = await env.JSHORT.get(slug)
			if(!redirectUrl) {
				return new Response("URL not found", { status: 404 })
			}
			
			let res = Response.redirect(redirectUrl, 301)
			await cache.put(cacheKey, res.clone());

			return res
		}
	},
} satisfies ExportedHandler<Env>;