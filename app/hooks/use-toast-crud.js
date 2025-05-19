'use client';
import React from "react"; // Add this import
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export function useToastCrud() {
    // Success toast for create operations
    const toastCreate = (title = "Created successfully", description = "") => {
        toast.success(
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    // Success toast for update operations
    const toastUpdate = (title = "Updated successfully", description = "") => {
        toast.success(
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    // Success toast for delete operations
    const toastDelete = (title = "Deleted successfully", description = "") => {
        toast.success(
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    // Error toast for any operation
    const toastError = (title = "An error occurred", description = "") => {
        toast.error(
            <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    // Warning toast
    const toastWarning = (title = "Warning", description = "") => {
        toast.warning(
            <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    // Info toast
    const toastInfo = (title = "Information", description = "") => {
        toast.info(
            <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-600" />
                <div>
                    <p className="font-medium">{title}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        );
    };

    return {
        toastCreate,
        toastUpdate,
        toastDelete,
        toastError,
        toastWarning,
        toastInfo
    };
}