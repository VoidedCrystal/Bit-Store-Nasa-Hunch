from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from .serializers import DocumentSerializer

class DocumentListCreate(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class DocumentDelete(generics.DestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)