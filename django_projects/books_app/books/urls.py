from .views import BookListView, BookDetailView, BookDeleteView, UpdateBookView
from django.urls import path
urlpatterns = [
    path('', BookListView.as_view(), name='books-home'),
    path('book/<int:pk>/', BookDetailView.as_view(), name='book-view'),
    path('book/<int:pk>/edit/', UpdateBookView.as_view(), name='book-update'),
    path('book/<int:pk>/delete/', BookDeleteView.as_view(),  name='book-delete')
]
