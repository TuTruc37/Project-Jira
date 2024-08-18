import { http } from './config';
export const commentInTasks = {
  getAll: comment => {
    return http.get(`/Comment/getAll?taskId=${comment}`);
  },
  postInsertComment: commentData => {
    return http.post('/Comment/insertComment', commentData);
  },
  putComment: (id, contentComment) => {
    return http.put(
      `/Comment/updateComment?id=${id}&contentComment=${encodeURIComponent(
        contentComment
      )}`
    );
  },
  deleteComment: deleteComment => {
    return http.delete(`/Comment/deleteComment?idComment=${deleteComment}`);
  },
};
{/* <Modal
width={900}
style={{ top: 20 }}
// title="Create task"
loading={loading}
open={isModalOpen}
onOk={handleOk}
onCancel={handleCancel}
footer={null}
>
<div>
  <h1 className="text-3xl font-bold">Create Task</h1>
  <form onSubmit={handleSubmit} className="space-y-3 mt-6 w-full">
    <div>
      <label
        className="block text-lg mb-2 mt-6 font-semibold text-black"
        htmlFor=""
      >
        Project
      </label>
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Chọn dự án"
        allowClear
        treeDefaultExpandAll
        value={values.projectId} // Gán giá trị hiện tại từ formik
        onChange={
          value => setFieldValue('projectId', value) // Cập nhật giá trị cho formik
        }
        filterTreeNode={filterTreeNode} // Add filterTreeNode to enable search
        treeData={gprojectId.map(project => ({
          ...project,
          title: project.projectName,
          value: project.id,
        }))}
      />
    </div>
    <InputCustom
      label="Task Name"
      name="taskName"
      handleChange={handleFieldChange}
      handleBlur={handleBlur}
      placeholder="Vui lòng nhập tên"
      error={errors.taskName}
      touched={touched.taskName}
      value={values.taskName}
      labelColor="text-black"
    />
    <SelectCustom
      label="Status"
      name="statusId"
      handleChange={handleChange}
      value={values.statusId}
      options={gstatusName} // Truyền danh sách loại người dùng từ API vào options
      labelColor="text-black"
      valueProp="statusId"
      labelProp="statusName"
    />
    <div className="grid grid-cols-2 gap-5">
      <SelectCustom
        label="Priority"
        name="priorityId"
        handleChange={handleChange}
        value={values.priorityId}
        options={gpriority} // Truyền danh sách loại người dùng từ API vào options
        labelColor="text-black"
        valueProp="priorityId"
        labelProp="priority"
      />

      <SelectCustom
        label="Task Type"
        name="typeId"
        handleChange={handleChange}
        value={values.typeId}
        options={gtaskType} // Truyền danh sách loại người dùng từ API vào options
        labelColor="text-black"
        valueProp="id"
        labelProp="taskType"
      />
    </div>
    <div className="grid grid-cols-2 gap-5">
      <div>
        <label
          className="text-lg mb-2 block font-semibold text-black"
          htmlFor=""
        >
          Assignees
        </label>
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          value={values.listUserAsign}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Vui lòng chọn thành viên"
          allowClear
          multiple
          treeDefaultExpandAll
          onChange={
            value => setFieldValue('listUserAsign', value) // Cập nhật giá trị cho formik
          }
          filterTreeNode={filterTreeNode} // Add filterTreeNode to enable search
          treeData={userAsign.map(user => ({
            ...user,
            title: user.name,
            value: user.userId,
          }))}
        />
      </div>
      <div>
        <label
          className="text-lg block text-black font-semibold"
          htmlFor=""
        >
          Time Tracking
        </label>
        <Slider
          value={timeTracking}
          onChange={handleSliderChange}
          tooltipVisible={false}
        />
        <div className="flex justify-between">
          <p className="text-md font-medium">
            {values.timeTrackingSpent}h logged
          </p>
          <p className="text-md font-medium">
            {values.timeTrackingRemaining}h remaining
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-5">
      <InputCustom
        label="Original Estimate"
        name="originalEstimate"
        handleChange={handleChange}
        handleBlur={handleBlur}
        error={errors.originalEstimate}
        touched={touched.originalEstimate}
        value={values.originalEstimate}
        labelColor="text-black"
      />
      <div className="grid grid-cols-2 gap-5">
        <InputCustom
          label="Time Spent (Hours)"
          name="timeTrackingSpent"
          handleChange={handleFieldChange}
          handleBlur={handleBlur}
          error={errors.timeTrackingSpent}
          touched={touched.timeTrackingSpent}
          value={values.timeTrackingSpent}
          labelColor="text-black"
        />
        <InputCustom
          label="Time Remaining (Hours)"
          name="timeTrackingRemaining"
          handleChange={handleFieldChange}
          handleBlur={handleBlur}
          error={errors.timeTrackingRemaining}
          touched={touched.timeTrackingRemaining}
          value={values.timeTrackingRemaining}
          labelColor="text-black"
        />
      </div>
    </div>

    <EditorTiny
      name="description"
      handleChange={value => setFieldValue('description', value)} // Cập nhật giá trị cho formik
      value={values.description}
    />
    <div className="">
      <button
        className="bg-blue-500 mt-10 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
        type="submit"
      >
        Submit
      </button>
    </div>
  </form>
</div>
</Modal> */}
// nhớ chép code vào dòng 527