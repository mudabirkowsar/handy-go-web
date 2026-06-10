'use client'

import React, { useState, useEffect } from 'react';
import { fetchCompanyProfile, updateCompanyProfile } from '../../service/CompanyAPI';

function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState('basics');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State matching your company schema structure
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    companySize: '1-5',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    managerName: '',
    managerPhone: '',
    serviceRadiusKm: 25,
    address: {
      officeNumber: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    businessHours: {
      monday: { isOpen: true, open: '09:00', close: '18:00' },
      tuesday: { isOpen: true, open: '09:00', close: '18:00' },
      wednesday: { isOpen: true, open: '09:00', close: '18:00' },
      thursday: { isOpen: true, open: '09:00', close: '18:00' },
      friday: { isOpen: true, open: '09:00', close: '18:00' },
      saturday: { isOpen: true, open: '09:00', close: '18:00' },
      sunday: { isOpen: false, open: '09:00', close: '18:00' }
    }
  });

  // Location fields separated for coordinate updates
  const [locationCoords, setLocationCoords] = useState({
    latitude: '',
    longitude: ''
  });

  // Media File uploads state variables
  const [files, setFiles] = useState({
    companyLogo: null,
    coverImage: null,
    companyPhotos: []
  });

  // Previews for local file visualization
  const [previews, setPreviews] = useState({
    companyLogo: '',
    coverImage: '',
    companyPhotos: []
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previews.companyLogo) URL.revokeObjectURL(previews.companyLogo);
      if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);
      previews.companyPhotos.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Load existing profile details on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchCompanyProfile();
        if (response?.success && response.company) {
          const comp = response.company;
          
          setFormData(prev => ({
            ...prev,
            companyName: comp.companyName || '',
            description: comp.description || '',
            website: comp.website || '',
            companySize: comp.companySize || '1-5',
            ownerName: comp.ownerName || '',
            ownerPhone: comp.ownerPhone || '',
            ownerEmail: comp.ownerEmail || '',
            managerName: comp.managerName || '',
            managerPhone: comp.managerPhone || '',
            serviceRadiusKm: comp.serviceRadiusKm || 25,
            address: { ...prev.address, ...comp.address },
            businessHours: { ...prev.businessHours, ...comp.businessHours }
          }));

          if (comp.location?.coordinates) {
            setLocationCoords({
              longitude: comp.location.coordinates[0] || '',
              latitude: comp.location.coordinates[1] || ''
            });
          }
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load profile details.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Input mutation handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], [field]: value }
      }
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles.length) return;

    if (name === 'companyPhotos') {
      const filesArray = Array.from(selectedFiles);
      setFiles(prev => ({ ...prev, [name]: filesArray }));
      
      const previewsArray = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => ({ ...prev, [name]: previewsArray }));
    } else {
      const file = selectedFiles[0];
      setFiles(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  // Submit profile logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const dataPayload = new FormData();

      // Flat fields
      dataPayload.append('companyName', formData.companyName);
      dataPayload.append('description', formData.description);
      dataPayload.append('website', formData.website);
      dataPayload.append('companySize', formData.companySize);
      dataPayload.append('ownerName', formData.ownerName);
      dataPayload.append('ownerPhone', formData.ownerPhone);
      dataPayload.append('ownerEmail', formData.ownerEmail);
      dataPayload.append('managerName', formData.managerName);
      dataPayload.append('managerPhone', formData.managerPhone);
      dataPayload.append('serviceRadiusKm', formData.serviceRadiusKm);

      // JSON Stringified sub-objects
      dataPayload.append('address', JSON.stringify(formData.address));
      dataPayload.append('businessHours', JSON.stringify(formData.businessHours));

      // Append Location coordinates directly into the fields
      if (locationCoords.latitude && locationCoords.longitude) {
        dataPayload.append('latitude', locationCoords.latitude);
        dataPayload.append('longitude', locationCoords.longitude);
      }

      // Files
      if (files.companyLogo) dataPayload.append('companyLogo', files.companyLogo);
      if (files.coverImage) dataPayload.append('coverImage', files.coverImage);

      if (files.companyPhotos.length > 0) {
        files.companyPhotos.forEach(file => {
          dataPayload.append('companyPhotos', file);
        });
      }

      await updateCompanyProfile(dataPayload);
      setMessage({ type: 'success', text: 'Company profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error processing validation profile details.' });
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-slate-500 gap-4">
        <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-bold tracking-wide">Fetching workspace configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/60">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Company Profile</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure company details, operating times, and visual assets.</p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Dynamic System Alert Messages */}
          {message.text && (
            <div className={`p-4 rounded-xl mb-8 text-sm font-bold flex items-center border ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
                : 'bg-rose-50 text-rose-700 border-rose-200/80'
            }`}>
              {message.text}
            </div>
          )}

          {/* Navigation Tab Row */}
          <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
            {[
              { id: 'basics', label: 'Basics & Contacts' },
              { id: 'address', label: 'Office Address' },
              { id: 'hours', label: 'Operating Hours' },
              { id: 'media', label: 'Media Branding' }
            ].map((tab) => (
              <button 
                key={tab.id} 
                type="button"
                onClick={() => setActiveTab(tab.id)} 
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer -mb-px ${
                  activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* TAB 1: Basics & Contacts Profile Configuration */}
            {activeTab === 'basics' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Company Essentials</h3>
                  <p className="text-xs font-semibold text-slate-400">Core company metrics and identity details visible to consumers.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Company Brand Name *</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleInputChange} 
                      required 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Company Scale / Size</label>
                    <select 
                      name="companySize" 
                      value={formData.companySize} 
                      onChange={handleInputChange} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800"
                    >
                      {["1-5", "6-10", "11-25", "26-50", "51-100", "100+"].map(size => (
                        <option key={size} value={size}>{size} Employees</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Description & Corporate Bio</label>
                  <textarea 
                    name="description" 
                    rows="4" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Provide a comprehensive operational summary of your firm's professional services..."
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800 resize-none leading-relaxed" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Official Website Link</label>
                    <input 
                      type="url" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com"
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Service Radius (Kilometers)</label>
                    <input 
                      type="number" 
                      name="serviceRadiusKm" 
                      value={formData.serviceRadiusKm} 
                      onChange={handleInputChange} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Owner & Representative Contacts</h3>
                  <p className="text-xs font-semibold text-slate-400">Primary communication contact lines mapped to management roles.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Owner Full Name *</label>
                    <input 
                      type="text" 
                      name="ownerName" 
                      value={formData.ownerName} 
                      onChange={handleInputChange} 
                      required 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Owner Contact Phone</label>
                    <input 
                      type="text" 
                      name="ownerPhone" 
                      value={formData.ownerPhone} 
                      onChange={handleInputChange} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Owner Email Address</label>
                    <input 
                      type="email" 
                      name="ownerEmail" 
                      value={formData.ownerEmail} 
                      onChange={handleInputChange} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Manager Full Name</label>
                    <input 
                      type="text" 
                      name="managerName" 
                      value={formData.managerName} 
                      onChange={handleInputChange} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Office Headquarter Address & Geospatial Coordinates Mapping */}
            {activeTab === 'address' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Corporate Office Address</h3>
                  <p className="text-xs font-semibold text-slate-400">Headquarters location particulars for dispatch mapping.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Office / Suite Number</label>
                    <input 
                      type="text" 
                      value={formData.address.officeNumber} 
                      onChange={(e) => handleNestedInputChange('address', 'officeNumber', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Street Address</label>
                    <input 
                      type="text" 
                      value={formData.address.street} 
                      onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Landmark Reference</label>
                    <input 
                      type="text" 
                      value={formData.address.landmark} 
                      onChange={(e) => handleNestedInputChange('address', 'landmark', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      value={formData.address.city} 
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">State / Province</label>
                    <input 
                      type="text" 
                      value={formData.address.state} 
                      onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Postal / ZIP Code</label>
                    <input 
                      type="text" 
                      value={formData.address.postalCode} 
                      onChange={(e) => handleNestedInputChange('address', 'postalCode', e.target.value)} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Geospatial Grid Coordinates</h3>
                  <p className="text-xs font-semibold text-slate-400">Direct spatial index mapping variables feeding backend distance algorithms.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Latitude Coordinates</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="e.g. 30.7046" 
                      value={locationCoords.latitude} 
                      onChange={(e) => setLocationCoords(prev => ({ ...prev, latitude: e.target.value }))} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Longitude Coordinates</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="e.g. 76.7179" 
                      value={locationCoords.longitude} 
                      onChange={(e) => setLocationCoords(prev => ({ ...prev, longitude: e.target.value }))} 
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Business Operating Schedules Configurations */}
            {activeTab === 'hours' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Weekly Availability Calendar</h3>
                  <p className="text-xs font-semibold text-slate-400">Determine operational business hour limits per standard day shifts.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/30">
                  {Object.keys(formData.businessHours).map((day) => {
                    const isOpen = formData.businessHours[day].isOpen;
                    return (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-white hover:bg-slate-50/40 transition-colors">
                        <div className="w-28 font-bold text-sm text-slate-700 capitalize">{day}</div>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`${day}-open-toggle`}
                            checked={isOpen} 
                            onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)} 
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-offset-0 accent-emerald-600"
                          />
                          <label htmlFor={`${day}-open-toggle`} className="text-sm font-bold text-slate-600 select-none cursor-pointer">Operational</label>
                        </div>

                        {isOpen ? (
                          <div className="flex items-center gap-3">
                            <input 
                              type="time" 
                              value={formData.businessHours[day].open || '09:00'} 
                              onChange={(e) => handleHoursChange(day, 'open', e.target.value)} 
                              className="p-2 border border-slate-200 bg-slate-50/30 rounded-lg text-sm font-bold text-slate-700 focus:border-emerald-500 focus:bg-white outline-none transition-all" 
                            />
                            <span className="text-slate-400 text-xs font-extrabold tracking-wide">TO</span>
                            <input 
                              type="time" 
                              value={formData.businessHours[day].close || '18:00'} 
                              onChange={(e) => handleHoursChange(day, 'close', e.target.value)} 
                              className="p-2 border border-slate-200 bg-slate-50/30 rounded-lg text-sm font-bold text-slate-700 focus:border-emerald-500 focus:bg-white outline-none transition-all" 
                            />
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg sm:w-44 text-center sm:text-right">Closed / Non-operational</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: Media Streaming Uploads Previews & Inputs Pipeline */}
            {activeTab === 'media' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1">Media Assets Branding</h3>
                  <p className="text-xs font-semibold text-slate-400">Stream logo vector designs and background banner graphic components.</p>
                  <div className="h-px bg-slate-100 mt-3" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Logo Picker Section */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Company Brand Logo</label>
                    <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30 space-y-4">
                      <input 
                        type="file" 
                        name="companyLogo" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100 transition-all" 
                      />
                      {previews.companyLogo && (
                        <div className="w-20 h-20 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                          <img src={previews.companyLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Picker Section */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Profile Background Banner</label>
                    <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30 space-y-4">
                      <input 
                        type="file" 
                        name="coverImage" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100 transition-all" 
                      />
                      {previews.coverImage && (
                        <div className="w-full h-20 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                          <img src={previews.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery Items Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Showcase Portfolio Gallery Images (Multiple)</label>
                  <div className="border border-slate-200 p-5 rounded-xl bg-slate-50/30 space-y-4">
                    <input 
                      type="file" 
                      name="companyPhotos" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100 transition-all" 
                    />
                    
                    {previews.companyPhotos.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3 pt-2">
                        {previews.companyPhotos.map((url, index) => (
                          <div key={index} className="aspect-square border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                            <img src={url} alt={`Gallery Preview ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-slate-400">No new files added to the current staging view.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Global Submit Action Button Section */}
            <div className="pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={submitting} 
                className={`w-full py-3.5 text-white text-sm font-bold rounded-xl shadow-sm tracking-wide transition-all focus:ring-4 cursor-pointer flex items-center justify-center gap-2 ${
                  submitting 
                    ? 'bg-slate-300 focus:ring-transparent cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20 active:bg-emerald-800'
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Syncing Updates...</span>
                  </>
                ) : (
                  'Commit Operational Updates'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Embedded CSS Animations for Fade Effects */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default CompanyProfilePage;