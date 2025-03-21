
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInventoryItem, updateInventoryItem } from "@/lib/api";
import { InventoryItem } from "@/types";
import LocationSelector from "./LocationSelector";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.coerce.number().min(0, "Price must be at least 0"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSuccess: () => void;
  initialData?: InventoryItem;
  onCancel: () => void;
}

const ProductForm = ({ onSuccess, initialData, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const isEditing = !!initialData;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      location: initialData?.location || "All Locations",
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || "pieces",
      unitPrice: initialData?.unitPrice || 0,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateInventoryItem(initialData.id, data);
        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        await createInventoryItem(data);
        toast({
          title: "Product added",
          description: `${data.name} has been added to inventory.`,
        });
      }
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast({
        variant: "destructive",
        title: isEditing ? "Failed to update product" : "Failed to add product",
        description: message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <LocationSelector
                  onChange={field.onChange}
                  currentLocation={field.value}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="pieces, kg, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="₹0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
