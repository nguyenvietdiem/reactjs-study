import { ErrorMessage } from "@hookform/error-message";
import { Button, Popconfirm } from "antd";
import { useForm } from "react-hook-form";
import productAPI from "../../api/productAPI";
import { useEffect, useState } from "react";
import imageAPI from "../../api/imageAPI";
import ButtonForm from "./ButtonForm";

type FieldType = {
  _id?: string;
  categoryId?: string;
  productName?: string;
  productImage?: string;
  price?: string;
  productFormat?: string;
  productDescription?: string;
  quantity?: number;
  inStock?: boolean;
  cost?: string;
  note?: string;
};

const ProductForm = ({
  isModalOpen,
  dataCategory,
  fetchData,
  handleCancel,
  selectedProduct,
  imageData,
  imageDelete,
  deleteImageUpload,
  setImageData,
  setImageDelete,
  setIsModalOpen,
  setSelectedProduct,
}: any) => {
  const [inStockChecked, setInStockChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockChecked(e.target.checked);
  };

  useEffect(() => {
    if (selectedProduct) {
      setValue("_id", selectedProduct.id);
      setValue("productName", selectedProduct.productName);
      setValue("categoryId", selectedProduct.categoryId);
      setValue("productFormat", selectedProduct.productFormat.join("\n"));
      setValue("productDescription", selectedProduct.productDescription);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setFocus("productName");
      }, 100);
    }
  }, [isModalOpen]);

  const getFileNameRemove = (url: string) => {
    const lastIndex = url.lastIndexOf("/");
    const questionIndex = url.indexOf("?");
    const res = url.substring(lastIndex + 1, questionIndex);
    return res;
  };
  // Upload image
  const handleUploadImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const param = {
        image: reader.result,
        fileName: file.name,
      };
      const res: any = await imageAPI.add(param);
      let url = res.url;
      let fileNameRemove = getFileNameRemove(url);
      if (imageDelete) {
        deleteImageUpload(imageDelete);
      }
      setImageData(url);
      setImageDelete(fileNameRemove);
    };
    reader.readAsDataURL(file);
  };
  // Delete image when click button delete
  const handleDeleteTemporarily = () => {
    setImageData("");
    let imageNameTemporarily = getFileNameRemove(imageData);
    deleteImageUpload(imageNameTemporarily);
  };

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<FieldType>();

  //   Submit form
  const onSubmit = async (data: any) => {
    let isError = false;
    try {
      if (selectedProduct) {
        const updateData: any = {};
        if (data.productName !== selectedProduct.productName) {
          updateData["productName"] = data.productName;
        }
        const dataUpdate = {
          _id: data._id,
          categoryId: data.categoryId,
          productFormat: data.productFormat,
          productDescription: data.productDescription,
          productImage: imageData,
          ...updateData,
        };
        await productAPI.update(dataUpdate);
      } else {
        const dataAPI = {
          productName: data.productName,
          categoryId: data.categoryId,
          price: data.price === "" ? 0 : data.price,
          productFormat: data.productFormat.split("\n"),
          productDescription: data.productDescription,
          quantity: data.quantity === "" ? 0 : data.quantity,
          productImage: imageData,
          inStock: inStockChecked,
          cost: data.cost === "" ? 0 : data.cost,
          note: data.note,
        };
        await productAPI.add(dataAPI);
      }
    } catch (error: any) {
      isError = true;
    }
    if (!isError) {
      reset();
      setIsModalOpen(false);
      setSelectedProduct(null);
      fetchData();
    }
  };

  //   Cancel modal
  const onCancel = () => {
    handleCancel();
    reset();
  };
  return (
    <form>
      <input type="hidden" {...register("_id")} />
      <div className="form-item">
        <label htmlFor="">Name *</label>
        <input
          {...register("productName", { required: "This is required." })}
        />
        <ErrorMessage errors={errors} name="productName" />
      </div>
      <div className="form-item">
        <label htmlFor="">Category *</label>
        <select defaultValue="" {...register("categoryId", { required: true })}>
          <option value="" disabled>
            Select category
          </option>
          {dataCategory.map((category: any) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <span>This field is required</span>}
      </div>
      <div className="form-item">
        <label htmlFor="">Type/Color</label>
        <textarea
          {...register("productFormat")}
          placeholder="Nhập mỗi loại nằm trên một dòng"
        ></textarea>
      </div>
      <div className="form-item">
        <label htmlFor="">Description</label>
        <textarea
          {...register("productDescription")}
          placeholder="Nội dung"
        ></textarea>
      </div>
      <div className="form-item">
        <input
          type="file"
          id="image"
          accept=".png, .jpg, .jpeg"
          onChange={handleUploadImage}
        />
      </div>
      {imageData ? (
        <div className="form-item">
          <img src={imageData} alt="" width={100} height={100} />
          <Popconfirm
            title="Bạn muốn xóa hình này à?"
            description="Xóa đi là mất luôn đó nha?"
            onConfirm={handleDeleteTemporarily}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ) : null}

      <div style={{ display: selectedProduct ? "none" : "block" }}>
        <div className="form-item">
          <label htmlFor="">Quantity</label>
          <input {...register("quantity")} placeholder="0" />
        </div>
        <div className="form-item">
          <label htmlFor="">Cost</label>
          <input {...register("cost")} placeholder="0" />
        </div>
        <div className="form-item">
          <label htmlFor="">Price</label>
          <input {...register("price")} placeholder="0" />
        </div>
        <div className="form-item">
          <label htmlFor="">InStock</label>
          <input
            {...register("inStock")}
            type="checkbox"
            checked={inStockChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="">Note *</label>
          <input
            {...register("note", {
              required: selectedProduct ? false : "This is required.",
            })}
          />
          <ErrorMessage errors={errors} name="note" />
        </div>
      </div>
      <ButtonForm onSubmit={handleSubmit(onSubmit)} onCancel={onCancel} />
    </form>
  );
};

export default ProductForm;
