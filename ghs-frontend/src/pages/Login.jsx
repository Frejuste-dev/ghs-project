import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormField from '../components/FormField';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Connexion réussie');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-slide-in-down">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover-lift">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Bienvenue sur <span className="text-blue-600">ChronosRH</span>
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Gestion des Heures Supplémentaires
          </p>
        </div>

        <form className="mt-8 space-y-6 animate-slide-in-up" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all-300">
            <div className="space-y-6">
              <FormField
                label="Nom d'utilisateur"
                name="username"
                type="text"
                register={register}
                errors={errors}
                required
                placeholder="Votre nom d'utilisateur"
              />

              <FormField
                label="Mot de passe"
                name="password"
                type="password"
                register={register}
                errors={errors}
                required
                placeholder="Votre mot de passe"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all-300"
                  />
                  <span className="ml-2 text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors-300">
                  Mot de passe oublié?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary py-3 text-base font-semibold shadow-lg hover:shadow-xl micro-bounce"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Se connecter
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Version 2.0.0 - © 2024 ChronosRH
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;