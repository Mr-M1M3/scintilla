<script lang="ts">
	export let data;
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	const auth_providers = data.auth_providers ?? [];
	// let is_redirected_from_oauth_provider: boolean;
	let is_redirected_from_oauth_provider = $page.url.searchParams.has('code');
	if (is_redirected_from_oauth_provider) {
		if (browser) {
			fetch('/login', {
				method: 'POST',
				headers: {
					'X-OAuth-Provider': localStorage.getItem('login__provider') ?? '',
					'X-OAuth-Code': decodeURIComponent($page.url.searchParams.get('code') ?? ''),
					'X-OAuth-Code-Verifier': localStorage.getItem('login__code_verifier') ?? ''
				},
				redirect: 'follow'
			})
				.then((resp) => goto(resp.headers.get('X-OAuth-Goto') ?? ''))
				.then((_) => {
					is_redirected_from_oauth_provider = $page.url.searchParams.has('code');
				});
		}
	}
	// console.log($page)
	function save_code_verifier(provider: string, val: string) {
		localStorage.setItem('login__code_verifier', val);
		localStorage.setItem('login__provider', provider);
	}
</script>

{#key is_redirected_from_oauth_provider}
	{#if !is_redirected_from_oauth_provider}
		{#each auth_providers as { name, authUrl, codeVerifier } (name)}
			<Card.Root class="m-2 max-w-screen-md mx-auto">
				<Card.Header>
					<Card.Title>Welcome Back!</Card.Title>
					<Card.Description>Awesome opportunities are waiting for you.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button
						on:click={() => {
							save_code_verifier(name, codeVerifier);
						}}
						href={authUrl}
						variant="outline"
						size="lg"
						class="w-full"
						><span class="mx-1 w-full h-full flex justify-center items-center gap-2"
							>Continue With <iconify-icon icon="mdi:{name}"></iconify-icon></span
						>
					</Button>
					<a href="/register" class="text-gray-300 inline-block my-1 w-full text-right underline"
						>Don't Have An Account? Register.</a
					>
				</Card.Content>
			</Card.Root>
		{/each}
	{:else}
		<h1 class="text-3xl m-auto text-center font-bold">
			You are being redirected <span class="animate-bounce">...</span>
		</h1>
	{/if}
{/key}
