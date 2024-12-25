from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    language = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    votes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    star = models.IntegerField(default=0)

    def vote(self, user):
        # get actual user
        print(user)
        # set vote weight according to user type
        if user.user_type == 'admin':  # Check if user is admin
            vote_weight = user.vote_weight
            print("admin",vote_weight)
        elif hasattr(user, 'linguist'):  # Check if user is linguist
            vote_weight = user.vote_weight
            print("linguist")
        elif hasattr(user, 'contributor'):  # Check if user is contributor
            vote_weight = user.vote_weight
            print("contributor")
            print(user)
        else:
            vote_weight = 1  # default vote weight
        # Add vote weight to initial weight
        self.votes += vote_weight
        
        self.save()


    def dislike(self):
        self.dislikes += 1
        self.save()

    def add_star(self, user):
        if user.user_type == 'linguist':
            self.star += 1
            self.save()

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class VotePost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="votes_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

class DislikePost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="dislike_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")
        
class StarPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="star_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")
