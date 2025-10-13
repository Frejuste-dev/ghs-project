import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import FormField from '../FormField';
import toast from 'react-hot-toast';

const LoginForm = () => {
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
    </form>
  );
};

export default LoginForm;
