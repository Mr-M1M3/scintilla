<script>
	export let data;
	const { events } = data;
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
</script>

{#each events.items as { name, id, type, submission_deadline, description, registration_url } (id)}
	<Card.Root>
		<Card.Header>
			<Card.Title tag="h2">
				<span>{name}</span>
			</Card.Title>
			<Card.Description>
				<Badge class="mt-2 uppercase">{type}</Badge>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Card.Description>
				<p>{description}</p>
			</Card.Description>
		</Card.Content>
		<Card.Footer>
			{@const deadline = new Date(submission_deadline ?? '')}
			{@const date = `${deadline.getUTCDate()}-${deadline.getUTCMonth()}-${deadline.getUTCFullYear()}`}
			{@const time = `${
				deadline.getUTCHours() > 12
					? `${deadline.getUTCHours() - 12}pm`
					: `${deadline.getUTCHours()}am`
			}`}
			<div class="w-full flex justify-between items-center">
				<Button
					variant="outline"
					on:click={() => {
						goto(`/events/${id}`);
					}}>View Details</Button
				>
				<Badge variant="secondary">{date} {time}</Badge>
			</div>
		</Card.Footer>
	</Card.Root>
{/each}

<style>
	p {
		@apply text-justify text-base tracking-wide;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased !important;
		-moz-font-smoothing: antialiased !important;
		text-rendering: optimizelegibility !important;
	}
</style>
