import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'

const ProfileSelectionPage = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [newProfile, setNewProfile] = useState({
        name: '',
        age: '',
        gender: '',
        relation: ''
    })

    useEffect(() => {
        if (user) {
            fetchProfiles()
        }
    }, [user])

    const fetchProfiles = async () => {
        try {
const response = await api.get(`/api/profiles/${user.uid}`)
            setProfiles(response.data.data || [])
        } catch (error) {
            console.error('Error fetching profiles:', error)
            toast.error('Failed to load profile matrix')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectProfile = (profileId) => {
        sessionStorage.setItem('selectedProfileId', profileId)
        const profile = profiles.find(p => p._id === profileId)
        if (profile) {
            sessionStorage.setItem('selectedProfileName', profile.name)
        }
        navigate('/dashboard')
    }

    const handleDeleteProfile = async (e, id) => {
        e.stopPropagation(); // Prevent card click event

        if (!window.confirm(t('confirm_purge'))) {
            return
        }

        try {
            const response = await api.delete(`/api/profiles/${id}`)

            

            toast.success("Profile deleted successfully")

            if (sessionStorage.getItem("selectedProfileId") === id) {
                sessionStorage.removeItem("selectedProfileId")
                sessionStorage.removeItem("selectedProfileName")
                navigate("/profiles")
            }

            fetchProfiles()
        } catch (error) {
            console.log("Delete error:", error.response?.data)
            toast.error(error.response?.data?.message || "Delete failed")
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Invalid format. Image map required.')
                return
            }
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCreateProfile = async (e) => {
    e.preventDefault();

    console.log("🚀 BUTTON CLICKED");
    console.log("👤 USER:", user);

    try {
        const formData = new FormData();

        if (!user || !user.uid) {
            console.log("❌ USER MISSING");
            toast.error("Authentication lost. Please login again.");
            return;
        }

        formData.append('userId', user.uid);
        formData.append('name', newProfile.name);
        formData.append('age', newProfile.age);
        formData.append('gender', newProfile.gender);
        formData.append('relation', newProfile.relation);

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log("📦 SENDING REQUEST...");

        const response = await api.post('/api/profiles/create', formData);

        console.log("✅ RESPONSE:", response.data);

        if (response.data.success) {
            toast.success('Bio-profile registered in vault');
            setShowCreateModal(false);
            resetForm();
            fetchProfiles();
        }
    } catch (error) {
        console.error("🔥 FULL ERROR:", error);
        toast.error(error.response?.data?.message || "Registration failed");
    }
};
if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <LoadingSpinner />
        </div>
    );
}

    return (
        <div className="min-h-screen py-16 px-4 bg-white flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-16 animate-fade-up">
                    <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.4em] text-white uppercase bg-black rounded-full">
                        {t('profile_matrix_title')}
                    </span>
                    <h1 className="text-6xl font-black text-black mb-6 tracking-tighter">
                        {t('select_profile_title')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        {t('select_profile_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in">
                    {profiles.map((profile) => (
                        <div
                            key={profile._id}
                            onClick={() => handleSelectProfile(profile._id)}
                            className="group relative bg-white p-10 rounded-[3rem] border-2 border-gray-100 transition-all duration-500 cursor-pointer hover:border-black hover:shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10 group-hover:bg-gray-100 group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700 opacity-20"></div>

                            {/* Purge Button (Visible on Hover Only) */}
                            <button
                                onClick={(e) => handleDeleteProfile(e, profile._id)}
                                className="absolute top-8 right-8 text-[8px] font-black text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-xl z-20"
                            >
                                {t('purge_record')}
                            </button>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl mb-8 overflow-hidden bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                                    {profile.imageUrl ? (
                                        <img
src={`${import.meta.env.VITE_API_BASE_URL}${profile.imageUrl}`}
                                            alt={profile.name}
                                            className="w-full h-full object-cover transition-all duration-700"
                                        />
                                    ) : (
                                        <span className="text-4xl font-black text-black opacity-20">{profile.name.charAt(0)}</span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-black mb-2 tracking-tighter uppercase">
                                    {profile.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                                        {profile.relation}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {profile.age} {t('age_cycles')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="group p-10 rounded-[3rem] border-2 border-dashed border-gray-200 hover:border-black transition-all duration-500 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white min-h-[300px]"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-gray-100 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:border-black group-hover:bg-black">
                            <span className="text-4xl text-gray-400 group-hover:text-white transition-colors">+</span>
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-black transition-colors">{t('register_profile')}</span>
                    </button>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-[4rem] p-12 max-w-lg w-full shadow-2xl animate-fade-up border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-20 -mt-20 -z-10"></div>

                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{t('bio_reg')}</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('profile_init')}</p>
                                </div>
                                <button
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all text-gray-400"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateProfile} className="space-y-8">
                                <div className="flex flex-col items-center">
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-2xl bg-white flex items-center justify-center cursor-pointer hover:border-black transition-all overflow-hidden relative group"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center group-hover:opacity-40 transition-opacity">
                                                <span className="text-5xl font-black text-gray-100">
                                                    ?
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">{t('upload_map')}</span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] mt-4">{t('optical_data')}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">{t('full_name')}</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={newProfile.name}
                                            onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="label">{t('bio_age')}</label>
                                            <input
                                                type="number"
                                                required
                                                className="input-field"
                                                value={newProfile.age}
                                                onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
                                                placeholder="00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="label">{t('gender_bias')}</label>
                                            <select
                                                required
                                                className="input-field"
                                                value={newProfile.gender}
                                                onChange={(e) => setNewProfile({ ...newProfile, gender: e.target.value })}
                                            >
                                                <option value="">{t('select')}</option>
                                                <option value="Male">{t('male')}</option>
                                                <option value="Female">{t('female')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">{t('profile_archetype')}</label>
                                        <input
                                            type="text"
                                            placeholder="Self, Parent, Dependent"
                                            required
                                            className="input-field"
                                            value={newProfile.relation}
                                            onChange={(e) => setNewProfile({ ...newProfile, relation: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary py-5 text-sm tracking-[0.2em] mt-4">
                                    {t('authorize_creation')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileSelectionPage
