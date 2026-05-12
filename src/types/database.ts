export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          privacy_email_scope: 'read' | 'draft'
          gmail_access_token: string | null
          gmail_refresh_token: string | null
          onboarding_complete: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          privacy_email_scope?: 'read' | 'draft'
          gmail_access_token?: string | null
          gmail_refresh_token?: string | null
          onboarding_complete?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          privacy_email_scope?: 'read' | 'draft'
          gmail_access_token?: string | null
          gmail_refresh_token?: string | null
          onboarding_complete?: boolean
          created_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          customer_id: string | null
          title: string
          status: Database['public']['Enums']['job_status']
          next_action: string | null
          next_due: string | null
          priority: Database['public']['Enums']['job_priority']
          start_date: string | null
          end_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id?: string | null
          title: string
          status?: Database['public']['Enums']['job_status']
          next_action?: string | null
          next_due?: string | null
          priority?: Database['public']['Enums']['job_priority']
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string | null
          title?: string
          status?: Database['public']['Enums']['job_status']
          next_action?: string | null
          next_due?: string | null
          priority?: Database['public']['Enums']['job_priority']
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          }
        ]
      }
      job_files: {
        Row: {
          id: string
          job_id: string
          filename: string
          filepath: string
          extracted_data: Json | null
          ai_confidence: number | null
          status: Database['public']['Enums']['file_status']
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          filename: string
          filepath: string
          extracted_data?: Json | null
          ai_confidence?: number | null
          status?: Database['public']['Enums']['file_status']
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          filename?: string
          filepath?: string
          extracted_data?: Json | null
          ai_confidence?: number | null
          status?: Database['public']['Enums']['file_status']
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_files_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          job_id: string
          amount: number
          due_date: string | null
          paid_amount: number
          status: Database['public']['Enums']['invoice_status']
          file_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          amount: number
          due_date?: string | null
          paid_amount?: number
          status?: Database['public']['Enums']['invoice_status']
          file_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          amount?: number
          due_date?: string | null
          paid_amount?: number
          status?: Database['public']['Enums']['invoice_status']
          file_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      job_timeline: {
        Row: {
          id: string
          job_id: string
          type: Database['public']['Enums']['timeline_type']
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          type?: Database['public']['Enums']['timeline_type']
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          type?: Database['public']['Enums']['timeline_type']
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_timeline_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      recurring: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number | null
          recurrence: Database['public']['Enums']['recurrence_interval']
          next_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount?: number | null
          recurrence?: Database['public']['Enums']['recurrence_interval']
          next_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number | null
          recurrence?: Database['public']['Enums']['recurrence_interval']
          next_date?: string
          created_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
        }
        Relationships: []
      }
      job_tags: {
        Row: {
          job_id: string
          tag_id: string
        }
        Insert: {
          job_id: string
          tag_id: string
        }
        Update: {
          job_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_tags_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      audit_log: {
        Row: {
          id: string
          table_name: string
          record_id: string
          user_id: string | null
          action: string
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          user_id?: string | null
          action: string
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          user_id?: string | null
          action?: string
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      approval_queue: {
        Row: {
          id: string
          user_id: string
          type: Database['public']['Enums']['approval_type']
          source_data: Json
          suggested_update: Json
          status: Database['public']['Enums']['approval_status']
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: Database['public']['Enums']['approval_type']
          source_data?: Json
          suggested_update?: Json
          status?: Database['public']['Enums']['approval_status']
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database['public']['Enums']['approval_type']
          source_data?: Json
          suggested_update?: Json
          status?: Database['public']['Enums']['approval_status']
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      job_status: 'inquiry' | 'quote_tosend' | 'quote_sent' | 'agreed' | 'rejected' | 'negotiation' | 'planned_start' | 'in_progress' | 'awaiting_payment' | 'archived'
      job_priority: 'high' | 'medium' | 'low'
      timeline_type: 'status_change' | 'email' | 'file' | 'note' | 'call'
      recurrence_interval: 'weekly' | 'monthly' | 'yearly'
      approval_type: 'document' | 'email'
      approval_status: 'pending' | 'approved' | 'rejected' | 'edited'
      file_status: 'pending' | 'approved' | 'rejected'
      invoice_status: 'sent' | 'paid' | 'overdue'
      email_scope: 'read' | 'draft'
    }
    CompositeTypes: Record<string, never>
  }
}
