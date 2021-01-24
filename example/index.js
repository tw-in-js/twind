/* eslint-env browser */
import './test'

import { tw, setup } from 'twind'
import { domSheet } from 'twind/sheets'
import { animation } from 'twind/css'

setup({ sheet: domSheet() })

const bounce = animation('1s ease infinite', {
  'from, 20%, 53%, 80%, to': {
    transform: 'translate3d(0,0,0)',
  },
  '40%, 43%': {
    transform: 'translate3d(0, -30px, 0)',
  },
  '70%': {
    transform: 'translate3d(0, -15px, 0)',
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)',
  },
})

const style = {
  main: tw`
    text-green-500
    bg-current
    xxx
    font-sans
    w-full
    min-h-screen
    flex
    items-center
    justify-center
    transition
    duration-1000
    hover:(
      sm:(bg-blue-600 text-blue-500)
      md:(text-purple-700 bg-purple-500)
    )
  `,
  card: tw`
    bg-white
    max-w-sm
    rounded-2xl
    overflow-hidden
    shadow-2xl
    border(current 8)
    rotate(
      -3 hover:6
      sm:(0 hover:3)
      md:(3 hover:-6)
    )
  `,
  tag: tw`
    inline-block
    bg-gray-200
    hover:(
      bg-gray-100
      text-gray-800
      shadow-lg
      ${bounce}
    )
    border(& gray-400)
    rounded-full
    px-2
    py-1
    text(sm gray-600)
    font-semibold
    cursor-pointer
  `,
}

document.body.innerHTML = `
  <main class="${style.main}">
  <div class="${style.card}">
    <img
      class="${tw('w-full')}"
      src="https://source.unsplash.com/WLUHO9A_xik/1600x900"
      alt="Sunset in the mountains" />
    <div class="${tw({ 'px-6': true, 'py-8': true, 'space-y-4': true })}">
      <div class="${tw`font-bold`}">
        <h1 class="${tw`text-3xl`}">The Coldest Sunset In The World</h1>
      </div>
      <div>
        <p class="${tw`text-gray-700 text-base`}">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
          Maiores et perferendis eaque, exercitationem praesentium nihil.
        </p>
      </div>
      <form class="${tw`flex flex-row space-x-4`}">
        <input
          class="${tw`w-full py-3 px-4 bg-gray-100 border(& gray-300) rounded sm:focus:(bg-gray-100 placeholder-current)`}"
          placeholder="Enter a value" />
        <button class="${tw`px-6 rounded bg-current font-bold`}">
          <span class="${tw`text-white`}">SEND</span>
        </button>
      </form>
    </div>
    <div class="${tw`px-6 py-4 bg-gray-100 border(t gray-300) space-x-2`}">
      <div class="${style.tag}"><span>#photography</span></div>
      <div class="${style.tag}"><span>#travel</span></div>
      <div class="${style.tag}"><span>#winter</span></div>
    </div>
  </div>
  </main>
`
