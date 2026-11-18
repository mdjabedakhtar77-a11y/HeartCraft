import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomizationForm from '../creator/CustomizationForm';
import api from '../services/api';

export default function CreateCardPage() {
  const { type = 'birthday' } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      try {
        if (templateId) {
          const res = await api.getTemplateById(templateId);
          if (res.success && res.template) {
            setTemplate(res.template);
          }
        } else {
          // Fallback fetch first template in this category
          const catRes = await api.getTemplatesByCategory(type);
          if (catRes.success && catRes.templates?.length > 0) {
            setTemplate(catRes.templates[0]);
          }
        }
      } catch (err) {
        console.warn('Error loading template for creator:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [type, templateId]);

  return (
    <div className="min-h-screen bg-[#0f0717] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <CustomizationForm template={template} categoryType={type} />
      </main>

      <Footer />
    </div>
  );
}
