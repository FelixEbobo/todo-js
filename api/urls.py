from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='apiOverview'),
    path('task-list/', views.taskList, name='taskList'),
    path('task-detail/<str:task_id>', views.taskDetail, name='taskDetail'),
    path('task-create/', views.taskCreate, name='taskCreate'),
    path('task-update/<str:task_id>', views.taskUpdate, name='taskUpdate'),
    path('task-delete/<str:task_id>', views.taskDelete, name='taskDelete'),
]
