const db = require("../models")
const Checklist_Item = db.checklist_item
const Op = db.Sequelize.Op

// Create and Save a new checklist item
exports.create = (req, res) => {
    console.log("add checklist item controller")

    //validate request
    if (!req.body.item_type || !req.body.name || !req.body.points) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    // Create a Checklist Item from data
    const checklist_item = {
        item_type: req.params.item_type,
        name: req.params.name,
        description: req.params.description,
        points: req.params.points,
        semester_number: req.params.semester_number
    };

    Checklist_Item.create(checklist_item)
        .then((data) => { res.send(data); })

        .catch((err) => {
            res.status(500).send({ message: err.message })
        })
}

// Retrieve all checklist items from the database
exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

    Checklist_Item.findAll({ where : condition })
        .then((data) => { res.send(data); })
        .catch((err) => { 
            res.status(500).send({
            message: err.message
        }) 
    });
}

exports.findOne = (req, res) => {
    const id = req.params.id;
    Checklist_Item.findByPK(id)
        .then((data) => {
            if(data) { 
                res.send(data) 
            } else { 
                res.status(400).send({
                message: `Cannot find checklist item with id=${id}.`
            })}
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving checklist item with id=" + id,
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id;
    Checklist_Item.update(req.body, {
        where: { id: id }
    })
    
    .then((num) => {
        if (num === 1) {
            res.send({
                message: "Checklist Item updated successfully."
            })
        } else {
            res.send({
                message: `Cannot update Checklist Item with id=${id}`
            })
        }
    })

    .catch((err) => {
        res.status(500).send({
            message: "Error updating Checklist Item with id=" + id,
        })
    })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Checklist_Item.destroy({
        where : { id: id}
    })
        .then((num) => {
            if (num === 1) {
                res.send({
                    message: "Checklist Item deleted!"
                })
            } else {
                res.send({
                    message: `Cannot delete Checklist Item with id=${id}`
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error deleting Checklist Item with id=${id}`
            })
        })
}

// Delete all Checklist Items from the database
exports.deleteAll = (req, res) => {
    Checklist_Item.destroy({
        where: {},
        truncate: true
    })
        .then((nums) => {
            res.send({
                message: `${nums} Checklist Items deleted!`
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: 
                    err.message || "Error deleting all Checklist Items"
            })
        })
}

