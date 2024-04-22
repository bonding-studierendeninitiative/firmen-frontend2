<nav class="bg-white border-b border-gray-300">
	<div class="flex justify-between items-center px-9 py-2">
		<slot />
		<div class="ml-1">
			<img src="./logo.png" alt="logo" class="h-4 w-18" />
		</div>

		<div class="space-x-4">
			<button>
				<i class="fas fa-bell text-cyan-500 text-lg"></i>
			</button>

			<button>
				<i class="fas fa-user text-cyan-500 text-lg"></i>
			</button>
		</div>
	</div>
</nav>
