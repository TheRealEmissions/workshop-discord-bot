let saveDBFunction = function saveDB(db) {
    console.log(`[LOG] Attempting to save a database!`)
    db.save().then((updated) => {
        console.log(`[LOG] Successfully saved the database! Please check below:`);
        console.log(`==========================================================`);
        console.log(updated);
        console.log(`==========================================================`);
    }).catch(err => console.error(err));
}

module.exports = saveDBFunction;