import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [tab, setTab] = useState('products');
    const navigate = useNavigate();
    const apiBase = '/api/admin';

    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({
        firstname: '', lastname: '', email: '', password: '', roles: ['ROLE_USER'],
    });

    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', image: '', category_id: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: '' });


    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [stats, setStats] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const fetchStats = async (period = 'all') => {
        try {
            const res = await fetch(`${apiBase}/stats?period=${period}`);
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error("Erreur stats :", e);
        }
    };
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetch(`${apiBase}/products`).then(r => r.json()).then(setProducts);
        fetch(`${apiBase}/categories`).then(r => r.json()).then(setCategories);
        fetch(`${apiBase}/users`).then(r => r.json()).then(setUsers);
        fetch(`${apiBase}/orders`).then(r => r.json()).then(setOrders);
        fetchStats();
        fetch(`${apiBase}/contacts`).then(r => r.json()).then(setContacts);

    }, []);

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.imageUrl;
    }

    const handleProductFormChange = e => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : '');
    };

    const startEditProduct = (prod = null) => {
        if (prod) {
            setEditingProduct(prod);
            setProductForm({
                name: prod.name, description: prod.description, price: prod.price,
                image: prod.image, category_id: prod.category?.id || ''
            });
            setPreviewUrl(prod.image || '');
        } else {
            setEditingProduct({});
            setProductForm({ name: '', description: '', price: '', image: '', category_id: '' });
            setPreviewUrl('');
        }
        setImageFile(null);
    };

    const resetProductForm = () => {
        setEditingProduct(null);
        setProductForm({ name: '', description: '', price: '', image: '', category_id: '' });
        setImageFile(null);
        setPreviewUrl('');
    };

    async function saveProduct(e) {
        e.preventDefault();
        let imageUrl = productForm.image;
        if (imageFile) {
            try {
                imageUrl = await uploadImage(imageFile);
            } catch {
                alert("Erreur lors de l'upload de l'image");
                return;
            }
        }

        const method = editingProduct?.id ? 'PUT' : 'POST';
        const url = editingProduct?.id ? `${apiBase}/products/${editingProduct.id}` : `${apiBase}/products`;

        const payload = { ...productForm, price: parseFloat(productForm.price), image: imageUrl };
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert(method === 'POST' ? 'Produit créé' : 'Produit mis à jour');
            resetProductForm();
            const list = await fetch(`${apiBase}/products`).then(r => r.json());
            setProducts(list);
        } else {
            const err = await res.json();
            alert('Erreur : ' + (err.message || err.errors?.join(', ') || ''));
        }
    }

    const deleteProduct = async (id) => {
        if (!window.confirm('Confirmer suppression ?')) return;
        const res = await fetch(`${apiBase}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Produit supprimé');
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert('Erreur suppression');
        }
    };

    // === CATEGORIES ===

    const handleCategoryFormChange = e => setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });

    const startEditCategory = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setCategoryForm({ name: cat.name });
        } else {
            setEditingCategory({});
            setCategoryForm({ name: '' });
        }
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '' });
    };

    const saveCategory = async (e) => {
        e.preventDefault();
        const method = editingCategory?.id ? 'PUT' : 'POST';
        const url = editingCategory?.id ? `${apiBase}/categories/${editingCategory.id}` : `${apiBase}/categories`;

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryForm),
        });

        if (res.ok) {
            alert(method === 'POST' ? 'Catégorie créée' : 'Catégorie modifiée');
            resetCategoryForm();
            const list = await fetch(`${apiBase}/categories`).then(r => r.json());
            setCategories(list);
        } else {
            const err = await res.json();
            alert('Erreur : ' + (err.message || err.errors?.join(', ') || ''));
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Confirmer suppression ?')) return;
        const res = await fetch(`${apiBase}/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Catégorie supprimée');
            setCategories(categories.filter(c => c.id !== id));
        } else {
            alert('Erreur suppression catégorie');
        }
    };

    // === USERS ===

    const handleUserFormChange = e => {
        const { name, value } = e.target;
        setUserForm(prev => ({ ...prev, [name]: name === 'roles' ? value.split(',').map(r => r.trim()) : value }));
    };

    const startEditUser = (user = null) => {
        if (user?.id) {
            setEditingUser(user);
            setUserForm({
                firstname: user.firstname, lastname: user.lastname, email: user.email, password: '', roles: user.roles
            });
        } else {
            setEditingUser({});
            setUserForm({ firstname: '', lastname: '', email: '', password: '', roles: ['ROLE_USER'] });
        }
    };

    const resetUserForm = () => {
        setEditingUser(null);
        setUserForm({ firstname: '', lastname: '', email: '', password: '', roles: ['ROLE_USER'] });
    };

    const saveUser = async (e) => {
        e.preventDefault();
        const isEdit = editingUser?.id;
        const url = isEdit ? `${apiBase}/users/${editingUser.id}` : `${apiBase}/users`;
        const method = isEdit ? 'PUT' : 'POST';

        const payload = {
            ...userForm,
            roles: Array.isArray(userForm.roles) ? userForm.roles : [userForm.roles],
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert(isEdit ? 'Utilisateur mis à jour' : 'Utilisateur créé');
            resetUserForm();
            const list = await fetch(`${apiBase}/users`).then((r) => r.json());
            setUsers(list);
        } else {
            const err = await res.json();
            alert('Erreur : ' + (err.message || err.errors?.join(', ') || ''));
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        const res = await fetch(`${apiBase}/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Utilisateur supprimé');
            setUsers(users.filter((u) => u.id !== id));
        } else {
            alert('Erreur suppression utilisateur');
        }
    };
    // orders
    const showDetails = async (id) => {
        const res = await fetch(`${apiBase}/orders/${id}`);
        const data = await res.json();
        setSelectedOrder(data);
    };

    const updateStatus = async (id, status) => {
        const res = await fetch(`${apiBase}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            alert('Statut mis à jour');
            const updatedOrders = await fetch(`${apiBase}/orders`).then(r => r.json());
            setOrders(updatedOrders);
            setSelectedOrder(null);
        } else {
            alert('Erreur mise à jour');
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Supprimer cette commande ?')) return;
        const res = await fetch(`${apiBase}/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Commande supprimée');
            setOrders(orders.filter(o => o.id !== id));
            setSelectedOrder(null);
        } else {
            alert('Erreur suppression');
        }
    };

    const inputStyle = {
        width: '100%', marginBottom: 10, padding: 8, borderRadius: 5, border: '1px solid #ccc'
    };
    const th = { padding: 8, border: '1px solid #ccc' };
    const td = { padding: 8, border: '1px solid #ccc' };

    return (
        <main style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 1200, margin: 'auto' }}>
            <h1>Administration ShelyCare</h1>
            <nav style={{ marginBottom: 20 }}>
                {['products', 'categories', 'users', 'orders', 'stats', 'contacts'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{
                            marginRight: 10,
                            padding: 10,
                            background: tab === t ? '#880e4f' : '#fce4ec',
                            color: tab === t ? 'white' : '#880e4f',
                            borderRadius: 5,
                            border: 'none',
                            cursor: 'pointer',
                        }}>
                        {t === 'products' ? 'Produits' : t === 'categories' ? 'Catégories' : t === 'users' ? 'Users' : t === 'orders' ? 'Commandes' : t === 'stats' ? 'Stats' : t === 'contacts' ? 'Contacts' : t}
                    </button>
                ))}
            </nav>

            {/* Produits */}
            {tab === 'products' && (
                <>
                    <h2>Produits</h2>
                    <button onClick={() => startEditProduct(null)} style={{ marginBottom: 15, ...inputStyle, width: 'auto', color: 'green' }}>
                        + Nouveau produit
                    </button>
                    {editingProduct && (
                        <form onSubmit={saveProduct} style={{ border: '2px solid black', padding: 25, borderRadius: 8 }}>
                            <input type="text" name="name" placeholder="Nom" value={productForm.name} onChange={handleProductFormChange} style={inputStyle} />
                            <textarea name="description" placeholder="Description" value={productForm.description} onChange={handleProductFormChange} style={inputStyle} rows={3} />
                            <input type="number" name="price" placeholder="Prix" value={productForm.price} onChange={handleProductFormChange} style={inputStyle} />
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {previewUrl && <img src={previewUrl} alt="Aperçu" style={{ maxWidth: 200, marginTop: 10 }} />}
                            <select name="category_id" value={productForm.category_id} onChange={handleProductFormChange} style={inputStyle}>
                                <option value="">-- Catégorie --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="submit" style={inputStyle}>Enregistrer</button>
                            <button type="button" onClick={resetProductForm} style={inputStyle}>Annuler</button>
                        </form>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={th}>Nom</th><th style={th}>Description</th><th style={th}>Prix</th><th style={th}>Catégorie</th><th style={th}>Image</th><th style={th}>Actions</th></tr></thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td style={td}>{p.name}</td>
                                    <td style={td}>{p.description}</td>
                                    <td style={td}>{p.price}</td>
                                    <td style={td}>{p.category?.name || ''}</td>
                                    <td style={td}>{p.image ? <img src={p.image} alt="" style={{ maxWidth: 60 }} /> : '—'}</td>
                                    <td style={td}>
                                        <button onClick={() => startEditProduct(p)} style={{
                                            background: '#880e4f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            marginRight: 5,
                                            cursor: 'pointer'
                                        }}>Modifier</button>
                                        <button onClick={() => deleteProduct(p.id)} style={{
                                            background: '#e53935',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            cursor: 'pointer'
                                        }}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Catégories */}
            {tab === 'categories' && (
                <>
                    <h2>Catégories</h2>
                    <button onClick={() => startEditCategory(null)} style={{ marginBottom: 15, ...inputStyle, width: 'auto', color: 'green' }}>+ Nouvelle catégorie</button>
                    {editingCategory && (
                        <form onSubmit={saveCategory} style={{ border: '2px solid black', padding: 25, borderRadius: 8 }}>
                            <input type="text" name="name" placeholder="Nom" value={categoryForm.name} onChange={handleCategoryFormChange} style={inputStyle} />
                            <button type="submit" style={inputStyle}>Enregistrer</button>
                            <button type="button" onClick={resetCategoryForm} style={inputStyle}>Annuler</button>
                        </form>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={th}>Nom</th><th style={th}>Actions</th></tr></thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c.id}>
                                    <td style={td}>{c.name}</td>
                                    <td style={td}>
                                        <button onClick={() => startEditCategory(c)} style={{
                                            background: '#880e4f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            marginRight: 5,
                                            cursor: 'pointer'
                                        }}>Modifier</button>
                                        <button onClick={() => deleteCategory(c.id)} style={{
                                            background: '#e53935',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            cursor: 'pointer'
                                        }}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Utilisateurs */}
            {tab === 'users' && (
                <>
                    <h2>Utilisateurs</h2>
                    <button onClick={() => startEditUser(null)} style={{ marginBottom: 15, ...inputStyle, width: 'auto', color: 'green' }}>+ Nouvel utilisateur</button>
                    {editingUser && (
                        <form onSubmit={saveUser} style={{ border: '2px solid black', padding: 25, borderRadius: 8  }}>
                            <input type="text" name="firstname" placeholder="Prénom" value={userForm.firstname} onChange={handleUserFormChange} style={inputStyle} />
                            <input type="text" name="lastname" placeholder="Nom" value={userForm.lastname} onChange={handleUserFormChange} style={inputStyle} />
                            <input type="email" name="email" placeholder="Email" value={userForm.email} onChange={handleUserFormChange} style={inputStyle} />
                            <input type="password" name="password" placeholder="Mot de passe" value={userForm.password} onChange={handleUserFormChange} style={inputStyle} required={!editingUser?.id} />
                            <input type="text" name="roles" placeholder="Rôles" value={userForm.roles.join(',')} onChange={handleUserFormChange} style={inputStyle} />
                            <button type="submit" style={inputStyle}>Enregistrer</button>
                            <button type="button" onClick={resetUserForm} style={inputStyle}>Annuler</button>
                        </form>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={th}>Prénom</th><th style={th}>Nom</th><th style={th}>Email</th><th style={th}>Rôles</th><th style={th}>Actions</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={td}>{u.firstname}</td>
                                    <td style={td}>{u.lastname}</td>
                                    <td style={td}>{u.email}</td>
                                    <td style={td}>{u.roles.join(', ')}</td>
                                    <td style={td}>
                                        <button onClick={() => startEditUser(u)} style={{
                                            background: '#880e4f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            marginRight: 5,
                                            cursor: 'pointer'
                                        }}>Modifier</button>
                                        <button onClick={() => deleteUser(u.id)} style={{
                                            background: '#e53935',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: 5,
                                            cursor: 'pointer'
                                        }}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Commandes */}
            {tab === 'orders' && (
                <>
                    <h2>Commandes</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                        <thead>
                            <tr>
                                <th style={th}>ID</th>
                                <th style={th}>Nom & Prenom</th>
                                <th style={th}>Adresse</th>
                                <th style={th}>Total</th>
                                <th style={th}>Statut</th>
                                <th style={th}>Date</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td style={td}>{o.id}</td>
                                    <td style={td}>
                                        <div style={{ lineHeight: 1.5 }}>
                                            <strong>{o.customer_firstname} {o.customer_lastname}</strong><br />
                                            <span style={{ fontSize: '0.9em', color: '#555' }}>{o.customer_email}</span>
                                        </div>
                                    </td>
                                    <td style={td}>
                                        <div style={{ fontSize: '0.9em', lineHeight: 1.4 }}>
                                            {o.adress?.split(',').map((line, i) => (
                                                <div key={i}>{line.trim()}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ ...td, fontWeight: 'bold' }}>{o.total.toFixed(2)} €</td>
                                    <td style={td}>
                                        <span style={{
                                            background: o.status === 'paid' ? '#c8e6c9' : o.status === 'shipped' ? '#ffe082' : '#ffcdd2',
                                            padding: '4px 8px',
                                            borderRadius: '5px',
                                            fontSize: '0.85em'
                                        }}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={td}>{o.created_at}</td>
                                    <td style={td}>
                                        <button
                                            onClick={() => showDetails(o.id)}
                                            style={{
                                                background: '#880e4f',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: 5,
                                                marginRight: 5,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Voir
                                        </button>
                                        <button
                                            onClick={() => deleteOrder(o.id)}
                                            style={{
                                                background: '#e53935',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: 5,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    {selectedOrder && (
                        <div style={{ background: '#fff0f6', padding: 15, borderRadius: 8 }}>
                            <h3>Détails commande #{selectedOrder.id}</h3>
                            <p><strong>Client :</strong> {selectedOrder.customer}</p>
                            <p><strong>Date :</strong> {selectedOrder.created_at}</p>
                            <p><strong>Total :</strong> {selectedOrder.total} €</p>
                            <p><strong>Statut :</strong> {selectedOrder.status}</p>

                            <h4>Produits :</h4>
                            <ul>
                                {selectedOrder.items.map((item, i) => (
                                    <li key={i}>{item.quantity} × {item.product} = {item.line_total} €</li>
                                ))}
                            </ul>

                            <div style={{ marginTop: 10 }}>
                                <label>Modifier le statut : </label>
                                <select defaultValue={selectedOrder.status} onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}>
                                    <option value="created">Créée</option>
                                    <option value="paid">Payée</option>
                                    <option value="shipped">Expédiée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>

                            <button onClick={() => setSelectedOrder(null)} style={{ marginTop: 10 }}>Fermer</button>
                        </div>
                    )}
                </>
            )}
            {/* Stats */}
            {tab === 'stats' && stats && (
                <div>



                    {/* Chiffres clés */}
                    <h2>
                        📊 Statistiques {selectedPeriod === 'week'
                            ? 'de la semaine'
                            : selectedPeriod === 'month'
                                ? 'du mois'
                                : selectedPeriod === 'year'
                                    ? 'de l\'année'
                                    : 'globales'}
                    </h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ marginRight: 10 }}>Filtrer par :</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => {
                                setSelectedPeriod(e.target.value);
                                fetchStats(e.target.value);
                            }}
                            style={{ padding: 8, borderRadius: 5 }}
                        >
                            <option value="all">Toutes</option>
                            <option value="week">7 derniers jours</option>
                            <option value="month">Ce mois</option>
                            <option value="year">Cette année</option>
                        </select>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8bbd0' }}>
                                <th style={th}>💰 CA</th>
                                <th style={th}>🛒 Commandes</th>
                                <th style={th}>🧾 Panier moyen</th>
                                <th style={th}>📦 Articles vendus</th>
                                <th style={th}>👥 Clients</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={td}>{stats.revenue.toFixed(2)} €</td>
                                <td style={td}>{stats.orders}</td>
                                <td style={td}>{stats.avgBasket.toFixed(2)} €</td>
                                <td style={td}>{stats.totalItemsSold}</td>
                                <td style={td}>{stats.users}</td>
                            </tr>
                        </tbody>
                    </table>



                    {/* Produits commandés */}
                    <h3>🛍️ Produits commandés</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fce4ec' }}>
                                <th style={th}>Produit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.productsOrdered.map((p, i) => (
                                <tr key={i}>
                                    <td style={td}>{p}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Clients */}
                    <h3>🧍 Clients</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8bbd0' }}>
                                <th style={th}>Prénom</th>
                                <th style={th}>Nom</th>
                                <th style={th}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.customers.map((c, i) => (
                                <tr key={i}>
                                    <td style={td}>{c.firstname}</td>
                                    <td style={td}>{c.lastname}</td>
                                    <td style={td}>{c.email}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>🔥 Produit le plus populaire</h3>
                    <p style={{ background: '#ffe0e0', padding: '10px', borderRadius: '5px' }}>
                        🏆 <strong>{stats.topProduct}</strong>
                    </p>
                </div>

            )}

            {/* contacts */}
            {tab === 'contacts' && (
                <>
                    <h2>Messages de contact</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>

                                <th style={th}>Nom</th>
                                <th style={th}>Email</th>
                                <th style={th}>Message</th>
                                <th style={th}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(msg => (
                                <tr key={msg.id}>
                                    <td style={td}>{msg.name}</td>
                                    <td style={td}>{msg.contact}</td>
                                    <td style={td}>{msg.message}</td>
                                    <td style={td}>{msg.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '2rem',
                    padding: '0.75rem 1.5rem',
                    background: '#f48fb1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                ⬅ Retour à l'accueil
            </button>
        </main>
    );
}

export default AdminDashboard;
