"use client";

import { useState, useEffect } from 'react';
import { Star, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { createReview, updateReview, deleteReview, getProductReviews } from '@/lib/api';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  user: {
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const { isAuthenticated, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, [productId, sortBy, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getProductReviews(productId, {
        page,
        limit: 10,
        sort: sortBy
      });
      setAllReviews(response.reviews);
      setReviews(response.reviews.slice(0, 2)); // Show only first 2 reviews
      setHasMore(response.pagination.hasNext);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      if (editingReview) {
        await updateReview(token, editingReview, reviewForm);
        toast.success('Review updated successfully');
      } else {
        await createReview(token, {
          productId,
          ...reviewForm
        });
        toast.success('Review submitted successfully');
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, title: '', comment: '' });
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review._id);
    setReviewForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated || !token) return;
    
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(token, reviewId);
      toast.success('Review deleted successfully');
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleViewMore = () => {
    setShowAllReviews(true);
    setReviews(allReviews);
  };

  const handleViewLess = () => {
    setShowAllReviews(false);
    setReviews(allReviews.slice(0, 2));
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              size={20}
              className={`${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">({totalReviews} reviews)</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>

          {isAuthenticated && (
            <Button
              onClick={() => setShowReviewForm(true)}
              size="sm"
            >
              Write Review
            </Button>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold mb-4">
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(reviewForm.rating, true, (rating) =>
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>

            <Input
              id="review-title"
              label="Review Title"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              placeholder="Summarize your experience"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Tell us about your experience with this product"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" size="sm">
                {editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 5, title: '', comment: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.user.name}</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {review.isVerified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}

        {allReviews.length > 2 && (
          <div className="text-center">
            {!showAllReviews ? (
              <Button
                variant="outline"
                onClick={handleViewMore}
                className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 rounded-3xl px-6 py-2"
              >
                View More Reviews
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleViewLess}
                className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 rounded-3xl px-6 py-2"
              >
                View Less
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
