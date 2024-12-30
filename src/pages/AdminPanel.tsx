import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useCommunicationMethodsStore } from '../store/communicationMethodsStore';
import { Company } from '../types';
import { CompanyForm } from '../components/admin/CompanyForm';
import { CompanyList } from '../components/admin/CompanyList';
import { CommunicationMethodList } from '../components/admin/CommunicationMethodList';
import { Button } from '../components/ui/Button';
import { Plus, Pencil } from 'lucide-react';
import { CompanyDetails } from '../components/admin/CompanyDetails';

export function AdminPanel() {
  const { companies, addCompany, updateCompany, deleteCompany } = useStore();
  const { methods } = useCommunicationMethodsStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSubmit = (data: Company) => {
    if (editingCompany) {
      updateCompany(data);
      setEditingCompany(null);
      setIsAdding(false);
      setSelectedCompany(data);
    } else {
      addCompany(data);
      setIsAdding(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCompany(null);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(selectedCompany?.id === company.id ? null : company);
  };

  return (
    <div className="space-y-6">
      {/* Companies Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Companies</h3>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            )}
          </div>

          {isAdding ? (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <CompanyForm
                initialData={editingCompany || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <>
              <CompanyList
                companies={companies}
                selectedCompanyId={selectedCompany?.id}
                onSelect={handleCompanySelect}
                onEdit={handleEdit}
                onDelete={deleteCompany}
              />
              
              {selectedCompany && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">Company Details</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(selectedCompany)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  </div>
                  <CompanyDetails company={selectedCompany} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Communication Methods Section */}
      {selectedCompany && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                Communication Methods for {selectedCompany.name}
              </h3>
            </div>
            <CommunicationMethodList companyId={selectedCompany.id} />
          </div>
        </div>
      )}
    </div>
  );
}