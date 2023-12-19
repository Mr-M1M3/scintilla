<script>
	export let data;
	const { event } = data;
    import { Badge } from "$lib/components/ui/badge";
	import * as Card from '$lib/components/ui/card';
    import { Button } from "$lib/components/ui/button";
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			<h1 class="text-4xl font-extrabold">{event?.name}</h1>
            <Badge class="uppercase" variant="secondary">{event?.type}</Badge>
		</Card.Title>
		<Card.Description>
            {@const deadline = new Date(event?.submission_deadline ?? '')}
			{@const date = `${deadline.getUTCDate()}-${deadline.getUTCMonth()}-${deadline.getUTCFullYear()}`}
			{@const time = `${
				deadline.getUTCHours() > 12
					? `${deadline.getUTCHours() - 12}pm`
					: `${deadline.getUTCHours()}am`
			}`}
            <Badge variant="outline" class="my-2">{date} {time}</Badge>
			<p>{event?.description}</p>
		</Card.Description>
		<Card.Description>
			<div class="rules">
				{@html event?.rules}
			</div>
		</Card.Description>
	</Card.Header>
    <Card.Footer>
        <Button variant="outline">Register Now!!!</Button>
    </Card.Footer>
</Card.Root>

<style>
	:global(p) {
		@apply my-3 text-justify text-lg tracking-wide;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased !important;
		-moz-font-smoothing: antialiased !important;
		text-rendering: optimizelegibility !important;
	}
	:global(div.rules) {
		@apply rounded-lg bg-secondary px-6 py-4 text-lg tracking-wide;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased !important;
		-moz-font-smoothing: antialiased !important;
		text-rendering: optimizelegibility !important;
	}
	:global(div.rules ul) {
		@apply mx-4 my-2;
		list-style-type: disc !important;
	}
	:global(div.rules ul li) {
		@apply mx-3;
	}
	:global(div.rules a) {
		@apply text-primary underline visited:text-violet-500;
	}
	:global(div.rules table) {
		@apply my-4;
	}
	:global(div.rules table td) {
		@apply border py-2 text-center;
		border-color: var(--border);
	}
    :global(div.rules img){
        @apply my-4;
    }
</style>
