const router = require('express').Router()
const {getAllSocials, getSocialById, findSocialByName, createSocial, updateSocial, deleteSocial} = require('../controllers/social.controller')

router.get('/', getAllSocials)
router.get('/id', getSocialById)
router.get('/name', findSocialByName)
router.post('/add', createSocial)
router.patch('/update', updateSocial)
router.delete('/delete', deleteSocial)

module.exports = router