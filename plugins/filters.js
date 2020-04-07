import Vue from 'vue'

function gameImageReplace (src, name) {
  const parts = src.split('/')
  parts[parts.length - 2] = name
  return parts.join('/')
}

Vue.filter('gameImageValidation', src =>
  src ? src : '//images.igdb.com/igdb/image/upload/t_thumb/co1wxi.jpg'
)
Vue.filter('gameImageCoverSmall', src => gameImageReplace(src, 't_cover_small'))
Vue.filter('gameImageCoverBig', src => gameImageReplace(src, 't_cover_big'))
