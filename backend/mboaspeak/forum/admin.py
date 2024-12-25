from django.contrib import admin
from .models import Post, Comment, VotePost, DislikePost, StarPost

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'language', 'votes', 'dislikes', 'star', 'created_at', 'updated_at')
    list_filter = ('language', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'language', 'user__username')
    ordering = ('-created_at',)
    readonly_fields = ('votes', 'dislikes', 'star')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'content', 'created_at', 'updated_at')
    search_fields = ('content', 'user__username', 'post__title')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(VotePost)
class VotePostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'timestamp')
    search_fields = ('user__username', 'post__title')
    list_filter = ('timestamp',)

@admin.register(DislikePost)
class DislikePostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'timestamp')
    search_fields = ('user__username', 'post__title')
    list_filter = ('timestamp',)

@admin.register(StarPost)
class StarPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'timestamp')
    search_fields = ('user__username', 'post__title')
    list_filter = ('timestamp',)
