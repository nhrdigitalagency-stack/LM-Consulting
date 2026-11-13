import { z } from 'zod';

export const ALLOWED_SERVICE_SLUGS = [
  'mise-a-niveau-structuration-strategique',
  'conseil-en-gestion-controle',
  'conseil-fiscal-et-comptable',
  'business-plan-et-financement',
  'creation-d-entreprise',
  'solutions-fintech',
  'digitalisation-et-systemes',
  'autre-besoin',
] as const;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Veuillez indiquer votre nom et prénom (au moins 2 caractères).')
    .max(120, 'Le nom ne peut pas dépasser 120 caractères.'),
  email: z
    .string()
    .trim()
    .email('Veuillez saisir une adresse électronique valide (ex. direction@entreprise.cm).')
    .max(160, "L'adresse électronique est trop longue."),
  phone: z
    .string()
    .trim()
    .min(8, 'Veuillez indiquer un numéro de téléphone joignable.')
    .max(30, 'Le numéro saisi est trop long.')
    .regex(/^[+\d\s().-]{8,30}$/, 'Format de numéro de téléphone invalide.'),
  company: z
    .string()
    .trim()
    .max(140, "Le nom de l'entreprise ne peut pas dépasser 140 caractères.")
    .optional()
    .default(''),
  city: z.enum(['Yaoundé', 'Douala', 'Autre ville / Diaspora']).default('Yaoundé'),
  serviceSlug: z.enum(ALLOWED_SERVICE_SLUGS, {
    message: 'Veuillez sélectionner le domaine concerné.',
  }),
  message: z
    .string()
    .trim()
    .min(20, 'Merci de préciser brièvement votre besoin (au moins 20 caractères).')
    .max(2500, 'Votre message ne peut pas dépasser 2 500 caractères.'),
  // Champ honeypot anti-robots : doit rester vide
  companyWebsite: z.string().max(200).optional().default(''),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
