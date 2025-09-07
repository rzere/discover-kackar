export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          locale: string
          name: string
          description: string | null
          content: Json | null
          hero_image_id: string | null
          icon_name: string | null
          color_theme: string | null
          sort_order: number
          is_active: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          locale?: string
          name: string
          description?: string | null
          content?: Json | null
          hero_image_id?: string | null
          icon_name?: string | null
          color_theme?: string | null
          sort_order?: number
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          locale?: string
          name?: string
          description?: string | null
          content?: Json | null
          hero_image_id?: string | null
          icon_name?: string | null
          color_theme?: string | null
          sort_order?: number
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_hero_image_id_fkey"
            columns: ["hero_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      content_items: {
        Row: {
          id: string
          category_id: string
          slug: string
          locale: string
          title: string
          meta_title: string | null
          meta_description: string | null
          content: Json | null
          featured_image_id: string | null
          gallery_image_ids: string[] | null
          status: Database["public"]["Enums"]["content_status"]
          published_at: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          slug: string
          locale?: string
          title: string
          meta_title?: string | null
          meta_description?: string | null
          content?: Json | null
          featured_image_id?: string | null
          gallery_image_ids?: string[] | null
          status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          slug?: string
          locale?: string
          title?: string
          meta_title?: string | null
          meta_description?: string | null
          content?: Json | null
          featured_image_id?: string | null
          gallery_image_ids?: string[] | null
          status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      images: {
        Row: {
          id: string
          filename: string
          original_filename: string
          file_path: string
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          category: Database["public"]["Enums"]["image_category"]
          alt_text: string | null
          caption: string | null
          tags: string[] | null
          is_optimized: boolean
          optimization_data: Json | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_filename: string
          file_path: string
          file_size: number
          mime_type: string
          width?: number | null
          height?: number | null
          category: Database["public"]["Enums"]["image_category"]
          alt_text?: string | null
          caption?: string | null
          tags?: string[] | null
          is_optimized?: boolean
          optimization_data?: Json | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_filename?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          width?: number | null
          height?: number | null
          category?: Database["public"]["Enums"]["image_category"]
          alt_text?: string | null
          caption?: string | null
          tags?: string[] | null
          is_optimized?: boolean
          optimization_data?: Json | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          id: string
          slug: string
          locale: string
          title: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          h1: string | null
          content: Json | null
          hero_image_id: string | null
          status: Database["public"]["Enums"]["content_status"]
          published_at: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          locale?: string
          title: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          h1?: string | null
          content?: Json | null
          hero_image_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          locale?: string
          title?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          h1?: string | null
          content?: Json | null
          hero_image_id?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_hero_image_id_fkey"
            columns: ["hero_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_settings: {
        Row: {
          id: string
          page_type: string
          page_id: string | null
          locale: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          og_title: string | null
          og_description: string | null
          og_image_id: string | null
          twitter_card: string
          canonical_url: string | null
          robots_meta: string | null
          schema_markup: Json | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          page_type: string
          page_id?: string | null
          locale?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_title?: string | null
          og_description?: string | null
          og_image_id?: string | null
          twitter_card?: string
          canonical_url?: string | null
          robots_meta?: string | null
          schema_markup?: Json | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          page_type?: string
          page_id?: string | null
          locale?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_title?: string | null
          og_description?: string | null
          og_image_id?: string | null
          twitter_card?: string
          canonical_url?: string | null
          robots_meta?: string | null
          schema_markup?: Json | null
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_settings_og_image_id_fkey"
            columns: ["og_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      image_category: "hero" | "category" | "content" | "gallery" | "admin_upload"
      user_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
