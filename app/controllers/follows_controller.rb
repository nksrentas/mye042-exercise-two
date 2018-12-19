class FollowsController < ApplicationController
	before_action :find_user

	def create
		@cu.follow(@searched_user)
		redirect_to :back
	end

	def destroy
		@cu.unfollow(@searched_user)
		redirect_to :back
	end

	private
	def find_user
		@cu = User.find(params[:current_user])
		@searched_user = User.find(params[:user_id])
	end
end
