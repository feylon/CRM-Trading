<template>
    <div class="bg-gray-900 h-[100vh]">

<div class="max-w-screen-xl bg-gray-900 mx-auto mt-[-20px] tradingbackfull my-7 lg:px-20 " id="contact">
  <form action="" method="post">
    <div class="w-full tradingback p-8  pt-[-130px] pt-0 my-4 mr-auto shadow-2xl md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 rounded-2xl">
      <div class="flex flex-col">
        <h1 class="text-5xl text-blue-400  font-bold ">Ro'yxatdan o'ting</h1>
        <h5 class="text-2xl text-blue-300  font-bold ">Biz siz bilan tezda bog'lanamiz</h5>

      </div>
      <div class="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
        <input class="w-full p-3 mt-2 text-gray-900 bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:border-outline" type="text" placeholder="Ismingiz" name="firstName" autocomplete="name" />
        <input class="w-full p-3 mt-2 text-gray-900 bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:shadow-outline" type="text" placeholder="Familiyangiz" name="lastName" autocomplete="family-name" />
        <input class="w-full p-3 mt-2 text-gray-900 hidden bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:shadow-outline" type="text" placeholder="Telefon raqamingiz" name="email" autocomplete="email" />
        <input class="w-full p-3 mt-2 text-gray-900 bg-gray-900 text-blue-400 rounded-lg focus:outline-none focus:shadow-outline" type="tel" placeholder="Telefon raqamingiz" name="phone" autocomplete="tel" />
      </div>
      <div class="my-4">
        <textarea placeholder="Message" class="w-full h-32 p-3 mt-2 bg-gray-900 text-blue-400 bg-gray-100 rounded-lg focus:outline-none focus:shadow-outline" name="message" autocomplete="message"></textarea>
      </div>
      <div class="flex justify-end w-[100%]">
        <div class="w-1/2 my-2 lg:w-1/4">
        <button type="submit" class="w-full p-3 text-sm font-bold tracking-wide text-gray-100 uppercase bg-gray-800 rounded rounded-xl hover:bg-blue-700-lg focus:outline-none focus:shadow-outline">
                        Send Message
                    </button>
      </div>
      </div>
    </div>
  </form>
  <div class="w-full px-8 py-12 ml-auto bg-[#1B6485] lg:-mt-96 lg:w-2/6 rounded-2xl">
    <div class="flex flex-col text-white">
      <div class="flex w-2/3 my-4 lg:w-1/2">
        <img class="pt-2 pr-2 h-7 w-7" src="https://icons8.com/icon/OBmVbH2qOGwK/location" alt="location">
        <div>
          <h2 class="text-2xl">Office</h2>
          <p class="text-gray-200" style="white-space: nowrap;">27B Grassfield, Lumely</p>
        </div>
      </div>
      <div class="flex w-2/3 my-4 lg:w-1/2">
        <img class="pt-2 pr-2 h-7 w-7 " src="https://icons8.com/icon/letUS1DJO1ou/call" alt="call us">
        <div>
          <h2 class="text-2xl">Call</h2>
          <p class="text-gray-200" style="white-space: nowrap;">Tel:+232-79-15-39-15</p>
        </div>
      </div>
      <div class="flex w-2/3 my-4 lg:w-1/2">
        <img class="pt-2 pr-2 h-7 w-7" src="https://icons8.com/icon/LPcVDft9Isqt/email" alt="Email us">
        <div>
          <h2 class="text-2xl">Email</h2>
          <p class="text-gray-200" style="white-space: nowrap;">Email:kanujosephmelvin@gmail.com</p>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
</template>

<script setup>
import url from "../base";
console.log(url)
</script>

<style >
.tradingback{
    background-image: url('./tradingback.png');
    background-size: cover;
}

</style>