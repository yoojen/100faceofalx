async function searchItem(model, option, include) {
    try {
        if (include.length > 0) {
            var item = await model.findAll({ where:  option, include: include })
        } else {
            var item = await model.findAll({ where:  option })
        }
        return item
    } catch (error) {
        console.log(error)   
        return null
    }
}

module.exports = searchItem;