var PostsCollection = Backbone.Collection.extend({
	model: PostModel
});

postsCollection = new PostsCollection();