<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	export let data;
	import { goto } from '$app/navigation';
	const auth_providers = data.oauth_providers;
	let is_redirected_from_oauth_provider = $page.url.searchParams.has('code');
	let { form, enhance, errors } = superForm(data.superforms_data);
	$: if ($page.form && ($page.status >= 400 || $page.status < 500)) {
		goto('/register').then((_) => {
			is_redirected_from_oauth_provider = $page.url.searchParams.has('code');
		});
	}
	function save_code_verifier(provider: string, val: string) {
		localStorage.setItem('code_verifier', val);
		localStorage.setItem('provider', provider);
	}
</script>

{#if !is_redirected_from_oauth_provider}
	{#each auth_providers as { name, authUrl, codeVerifier } (name)}
		<Card.Root class="m-2 max-w-screen-md mx-auto">
			<Card.Header>
				<Card.Title>Register</Card.Title>
				<Card.Description>Be A Part Of Us</Card.Description>
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
				<a href="/login" class="text-gray-300 inline-block my-1 w-full text-right underline"
					>Already Have An Account? Login.</a
				>
			</Card.Content>
		</Card.Root>
	{/each}
{/if}
{#if is_redirected_from_oauth_provider}
	<form method="POST" class="max-w-screen-md m-auto my-4 px-2" use:enhance>
		{#if browser}
			<input
				type="text"
				hidden
				name="code_verifier"
				value={localStorage?.getItem('code_verifier') ?? ''}
			/>
			<input
				type="text"
				hidden
				name="oauth_code"
				value={decodeURIComponent($page.url.searchParams.get('code') ?? '')}
			/>
			<input type="text" hidden name="provider" value={localStorage?.getItem('provider')} />
		{/if}
		<Card.Root>
			<Card.Header>
				<Card.Title>Register to SCINTILLA</Card.Title>
				<Card.Description>Be a general member of SCINTILLA</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="my-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder="The name you go by" bind:value={$form.name} />
					{#if $errors.name}
						<p class="error-msg">{$errors.name[0]}</p>
					{/if}
				</div>
				<div class="cls-sec-roll">
					<div>
						<div>
							<Label for="class">Class</Label>
							<Input
								id="class"
								name="class"
								placeholder="What class do you read in?"
								bind:value={$form.class}
							/>
							{#if $errors.class}
								<p class="error-msg">{$errors.class[0]}</p>
							{/if}
						</div>
						<div>
							<Label for="roll">Roll No</Label>
							<Input
								id="roll"
								name="roll"
								placeholder="What is your roll no?"
								bind:value={$form.roll}
							/>
							{#if $errors.roll}
								<p class="error-msg">{$errors.roll[0]}</p>
							{/if}
						</div>
					</div>
					<div>
						<Label for="section">Section</Label>
						<Input
							id="section"
							name="section"
							placeholder="What section of your class do you come from?"
							bind:value={$form.section}
						/>
						{#if $errors.section}
							<p class="error-msg">{$errors.section[0]}</p>
						{/if}
					</div>
				</div>
				<div class="my-2">
					<Label for="contact_self">Phone Number (Self)</Label>
					<Input
						id="contact_self"
						name="contact_self"
						placeholder="Your phone number to contact?"
						bind:value={$form.contact_self}
					/>
					{#if $errors.contact_self}
						<p class="error-msg">{$errors.contact_self[0]}</p>
					{/if}
				</div>
				<div class="my-2">
					<Label for="contact_parent">Phone Number (Parent)</Label>
					<Input
						id="contact_parent"
						name="contact_parent"
						placeholder="Your parent's phone number?"
						bind:value={$form.contact_parent}
					/>
					{#if $errors.contact_parent}
						<p class="error-msg">{$errors.contact_parent[0]}</p>
					{/if}
				</div>
			</Card.Content>
			<Card.Footer>
				<Button class="w-full" type="submit">Complete Registration</Button>
			</Card.Footer>
		</Card.Root>
	</form>
{/if}

<style>
	.cls-sec-roll {
		@apply flex flex-col gap-4 md:flex-row;
	}
	.cls-sec-roll > div:not(:last-child) {
		@apply grid w-full grid-cols-2 grid-rows-1 gap-4;
	}
	.cls-sec-roll > div:not(.cls-roll) {
		@apply w-full;
	}
	.error-msg {
		@apply my-1 capitalize text-red-600;
	}
</style>
