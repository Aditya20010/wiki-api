//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true });
const articleSchema = {
	title: String,
	content: String
};
const Article = mongoose.model("Article", articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//request targeting articles
app.route("/articles")
.get(function(req, res){
	Article.find(function(err, foundArticles){
	 if(!err){
		  res.send(foundArticles);
	 } else{
		 res.send(err);
	 }
	
	});
} )
.post(function(req, res){
	console.log();
	console.log();
	
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content
	});
	newArticle.save(function(err){
	if(!err){
	  	res.send("successfully added a new article.");
	}else{
	res.send(err);	
	}
	});
} )
.delete( function(req, res){
	Article.deleteMany(function(err){
		if(!err){
			res.send("successfully deleted all articles.");
		}else{
			res.send(err);
		}
	});
} );
// request targeting specific article
app.route("/articles/:articletitle")
.get(function(req, res){
	Article.findOne({title: req.params.articletitle}, function(err, foundarticle){
		if(foundarticle){
			res.send(foundarticle);
		}else{
			res.send("no matching articles were found");
		}
	});
})
.put(function(req,res){
	Article.update(
	{title: req.params.articletitle},
	{title: req.body.title, content: req.body.content},
		{overwrite: true},
		function(err){
			if(!err){
				res.send("successfully updated article.");
			}
		}
	);
})
.delete( function(req, res){
	Article.deleteOne(
	{title: req.params.articletitle},
	function(err){
		if(!err){
			res.send("successfully deleted the respective article.");
		}else{
			res.send(err);
		}
});
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});