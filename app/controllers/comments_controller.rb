class CommentsController < ApplicationController
	def index

	end

	def new
		@comment = Comment.new
		@temp = params[:user_id]
	end

	def show
		@comment = Comment.find(params[:id])
	end
	def create
		#render plain: params[:comment].inspect
		@comment = Comment.new(comment_params)
		@comment.photo_id = params[:photo_id]
		@comment.user_id = params[:user_id]
		@comment.save
		redirect_to user_path(id: params[:user_id])
	end
	private 
	def comment_params
		params.require(:comment).permit(:context)
	end
end