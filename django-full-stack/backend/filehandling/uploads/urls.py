from django.urls import path
from .views import DocumentListCreate, DocumentDelete

urlpatterns = [
    path('documents/', DocumentListCreate.as_view(), name='document_list_create'),
    path('documents/<int:pk>/', DocumentDelete.as_view(), name='document_delete'),
]