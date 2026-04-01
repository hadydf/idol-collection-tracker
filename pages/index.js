import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, Share2, Search, Star } from 'lucide-react';

export default function IdolCollectionTracker() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('collection');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    memberName: '',
    groupName: '',
    type: 'photocard',
    imageUrl: '',
    condition: 'mint',
    addedDate: new Date().toISOString().split('T')[0],
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('idolCollection');
    const savedWishlist = localStorage.getItem('idolWishlist');
    if (saved) setItems(JSON.parse(saved));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('idolCollection', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('idolWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addItem = (e) => {
    e.preventDefault();
    if (!formData.memberName || !formData.groupName) return;

    const newItem = {
      id: Date.now(),
      ...formData,
    };
    setItems([newItem, ...items]);
    setFormData({
      memberName: '',
      groupName: '',
      type: 'photocard',
      imageUrl: '',
      condition: 'mint',
      addedDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const addToWishlist = (e) => {
    e.preventDefault();
    if (!formData.memberName || !formData.groupName) return;

    const newWish = {
      id: Date.now(),
      ...formData,
    };
    setWishlist([newWish, ...wishlist]);
    setFormData({
      memberName: '',
      groupName: '',
      type: 'photocard',
      imageUrl: '',
      condition: 'mint',
      addedDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const deleteWish = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item =>
    item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWishlist = wishlist.filter(item =>
    item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalItems: items.length,
    byType: {
      photocard: items.filter(i => i.type === 'photocard').length,
      album: items.filter(i => i.type === 'album').length,
      poster: items.filter(i => i.type === 'poster').length,
      merch: items.filter(i => i.type === 'merch').length,
    },
    wishlistCount: wishlist.length,
  };

  const shareProfile = () => {
    const message = `✨ My Idol Collection Tracker Stats:\n📊 Total Items: ${stats.totalItems}\n🎫 Photocards: ${stats.byType.photocard}\n💿 Albums: ${stats.byType.album}\n🖼️ Posters: ${stats.byType.poster}\n⭐ Wishlist: ${stats.wishlistCount}\n\nJoin me in tracking our idol collections!`;
    
    if (navigator.share) {
      navigator.share({ title: 'My Idol Collection', text: message });
    } else {
      const encoded = encodeURIComponent(message);
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>✨ Idol Collection</h1>
          <p style={styles.subtitle}>Track your K-pop & J-pop treasures</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>{stats.totalItems}</div>
          <div style={styles.statLabel}>Items</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>{stats.byType.photocard}</div>
          <div style={styles.statLabel}>Photocards</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>{stats.wishlistCount}</div>
          <div style={styles.statLabel}>Wishlist</div>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <Search size={18} color="#ff6b9d" />
        <input
          type="text"
          placeholder="Search member or group..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('collection')}
          style={{
            ...styles.tab,
            ...(activeTab === 'collection' ? styles.tabActive : styles.tabInactive),
          }}
        >
          📦 Collection ({filteredItems.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          style={{
            ...styles.tab,
            ...(activeTab === 'wishlist' ? styles.tabActive : styles.tabInactive),
          }}
        >
          ⭐ Wishlist ({filteredWishlist.length})
        </button>
      </div>

      {/* Collection Tab */}
      {activeTab === 'collection' && (
        <div style={styles.content}>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={styles.addButton}>
              <Plus size={20} /> Add to Collection
            </button>
          ) : (
            <form onSubmit={addItem} style={styles.form}>
              <input
                type="text"
                placeholder="Member name (e.g., Jisoo)"
                value={formData.memberName}
                onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Group name (e.g., BLACKPINK)"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                style={styles.input}
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={styles.input}
              >
                <option value="photocard">Photocard</option>
                <option value="album">Album</option>
                <option value="poster">Poster</option>
                <option value="merch">Merch</option>
              </select>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                style={styles.input}
              >
                <option value="mint">Mint</option>
                <option value="near-mint">Near Mint</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                style={styles.input}
              />
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>Save Item</button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div style={styles.itemsGrid}>
              {filteredItems.map((item) => (
                <div key={item.id} style={styles.itemCard}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.memberName} style={styles.itemImage} />
                  )}
                  <div style={styles.itemContent}>
                    <div style={styles.itemName}>{item.memberName}</div>
                    <div style={styles.itemGroup}>{item.groupName}</div>
                    <div style={styles.itemMeta}>
                      <span style={styles.badge}>{item.type}</span>
                      <span style={styles.badge}>{item.condition}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎫</div>
              <p style={styles.emptyText}>
                {searchQuery ? 'No items found' : 'Start collecting!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div style={styles.content}>
          {!showForm ? (
            <button
              onClick={() => {
                setShowForm(true);
              }}
              style={styles.addButton}
            >
              <Plus size={20} /> Add to Wishlist
            </button>
          ) : (
            <form
              onSubmit={addToWishlist}
              style={styles.form}
            >
              <input
                type="text"
                placeholder="Member name"
                value={formData.memberName}
                onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Group name"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                style={styles.input}
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={styles.input}
              >
                <option value="photocard">Photocard</option>
                <option value="album">Album</option>
                <option value="poster">Poster</option>
                <option value="merch">Merch</option>
              </select>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>Add to Wishlist</button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {filteredWishlist.length > 0 ? (
            <div style={styles.itemsGrid}>
              {filteredWishlist.map((item) => (
                <div key={item.id} style={{ ...styles.itemCard, opacity: 0.85 }}>
                  <div style={styles.wishIcon}>⭐</div>
                  <div style={styles.itemContent}>
                    <div style={styles.itemName}>{item.memberName}</div>
                    <div style={styles.itemGroup}>{item.groupName}</div>
                    <div style={styles.itemMeta}>
                      <span style={styles.badge}>{item.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWish(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⭐</div>
              <p style={styles.emptyText}>
                {searchQuery ? 'No wishlist items found' : 'Add items you want next!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Share Button */}
      <button onClick={shareProfile} style={styles.shareButton}>
        <Share2 size={18} /> Share Your Collection
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 75%, #4facfe 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    padding: '16px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#333',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '28px 20px',
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
    fontWeight: '500',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  statBox: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#667eea',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '600',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '12px 16px',
    marginBottom: '20px',
    gap: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  tabInactive: {
    background: 'rgba(255, 255, 255, 0.5)',
    color: '#999',
  },
  content: {
    marginBottom: '20px',
  },
  addButton: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    cursor: 'pointer',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
  },
  form: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '2px solid #eee',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    background: '#f0f0f0',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  itemCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    background: '#f0f0f0',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
  },
  itemGroup: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '8px',
  },
  itemMeta: {
    display: 'flex',
    gap: '6px',
  },
  badge: {
    display: 'inline-block',
    background: '#f0f0f0',
    color: '#666',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  wishIcon: {
    fontSize: '24px',
    marginRight: '8px',
  },
  deleteButton: {
    background: '#ff6b9d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#999',
    fontSize: '14px',
    margin: 0,
    fontWeight: '500',
  },
  shareButton: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#764ba2',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    right: '16px',
    zIndex: 100,
  },
};
