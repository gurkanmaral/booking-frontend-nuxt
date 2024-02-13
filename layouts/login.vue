

<template>  

    <div class="w-full flex h-screen flex-row relative">
        <div class="w-full relative">
            <img src="/assets/images/hotel-bg.jpg" alt="bg" class="w-full h-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center">
                <slot />
            </div>
        </div>
    </div>
</template>