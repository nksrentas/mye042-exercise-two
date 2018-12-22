class CommentsController < ApplicationController
	def index

	end

	def new
		@comment = Comment.new
		@user_id = params[:user_id]
		@photo_id = params[:photo_id]
		@currentComments = Comment.where(photo_id: params[:photo_id]).order("created_at DESC")
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

		format.html {redirect_to user_path(id: params[:user_id])}
		
	end
	private 
	def comment_params
		params.require(:comment).permit(:context)
	end
end