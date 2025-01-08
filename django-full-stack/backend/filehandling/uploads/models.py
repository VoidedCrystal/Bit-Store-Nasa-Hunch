from django.db import models

class Document(models.Model):
    description = models.CharField(max_length=255)
    document = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Ensure this field is defined

    def delete(self, *args, **kwargs):
        self.document.delete(save=False)  # Delete the file from the filesystem
        super().delete(*args, **kwargs)  # Call the superclass delete method