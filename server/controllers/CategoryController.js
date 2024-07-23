
const categoryModel = require("../models/CategoryModel")
const slugify = require("slugify")



exports.createCategory = async(req, res)=>{
    try{
        
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message:"Name is required"
            })
        }

        const existingCategory = await categoryModel.findOne({name})

        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already exists"
            })
        }

        const category = await new categoryModel({name, slug:slugify(name)}).save()

        res.status(201).send({
            success:true,
            message:"Category Successfully created",
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in create category"
        })
    }
}

exports.updateCAtegory = async(req,res)=>{
    try{

        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new:true})

        res.status(200).send({
           success:true,
           message:"Category Updated Successfully",
           category
        })


    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Update category"
        })
    }
}


exports.getAllCategory = async (req, res) => {
    try {
      const categories = await categoryModel.find().exec();
      res.status(200).send({
        success: true,
        message: "All Categories List",
        categories,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send({
        success: false,
        message: "Error in getting all categories",
        error: error.message,
      });
    }
  };


exports.getSingleCategory = async(req,res)=>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"get single Categorie Successfully",
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in get category"
        })
    }
}


exports.deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Delete Category Successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Delete Category"
        })
    }
}