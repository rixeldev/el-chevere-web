import { z } from 'zod'

// Sign in validation schema
export const signInSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(6, 'Password must be at least 6 characters'),
})

// Phone number validation - supports various formats
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/

// Sign up validation schema
export const signUpSchema = z
	.object({
		fullName: z
			.string()
			.min(1, 'Full name is required')
			.min(2, 'Full name must be at least 2 characters')
			.max(100, 'Full name must be less than 100 characters')
			.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Full name can only contain letters and spaces'),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email address'),
		phone: z
			.string()
			.min(1, 'Phone number is required')
			.regex(phoneRegex, 'Invalid phone number format')
			.refine((val) => val.replace(/\D/g, '').length >= 10, 'Phone number must have at least 10 digits')
			.refine((val) => val.replace(/\D/g, '').length <= 15, 'Phone number must have at most 15 digits'),
		password: z
			.string()
			.min(1, 'Password is required')
			.min(6, 'Password must be at least 6 characters')
			.max(100, 'Password must be less than 100 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z
			.string()
			.min(1, 'Please confirm your password'),
		avatar: z
			.instanceof(File)
			.optional()
			.refine(
				(file) => !file || file.size <= 5 * 1024 * 1024,
				'Image size must be less than 5MB'
			)
			.refine(
				(file) => !file || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
				'Image must be JPEG, PNG, or WebP'
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

