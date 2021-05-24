module.exports = {
  darkMode: 'class',
  purge: {
    enabled: true,
    content: ['./*/*.html'],
    options: {
      safelist: [
        'bg-gray-300',
        'bg-black',
        'bg-red-200',
        'font-black',
        'text-red-700',
        'text-5xl',
        'p-8',
        'dark'
      ]
    }
  },
  theme: {
    fontFamily: {
     'main': ['Inter', 'sans-serif']
    }
  },
 }