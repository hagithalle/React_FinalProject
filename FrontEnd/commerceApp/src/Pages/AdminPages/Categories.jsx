import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, addCategory, updateCategory, deleteCategory, reset } from "../../dl/Slices/categoriesSlice";
import { TextField, Button, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
      maxWidth: '450px',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center'
}));

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, isLoading, isError, isSuccess, message } = useSelector(state => state.categories);
    const [token, setToken]  = useState(sessionStorage.getItem("token"))

    const [newCategory, setNewCategory] = useState("");
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    useEffect(() => {
      console.log("message:" ,message)
           console.log("cat:", token)
        dispatch(getAllCategories(token));
        console.log(categories)
        return () => {
            dispatch(reset());
        };
    }, [dispatch],message);

    const handleAddCategory = () => {
        dispatch(addCategory({ category: { name: newCategory }, token: token }));       
        setNewCategory("");
         // Re-fetch categories after adding a new one
         dispatch(getAllCategories(token));
    };

    const handleEditCategory = (id, name) => {
        console.log("handleEditCategory: ", id, name)
        setEditCategoryId(id);
        setEditCategoryName(name);
    };

    const handleSaveCategory = (id) => {
        console.log("befor:", categories)
        //const index = categories.findIndex(cat => cat._id === id)
        //console.log("index:", index)
        const categoryToUpdate = categories.find(cat => cat._id === id);
        if (categoryToUpdate ) {
            // Create a new object instead of modifying the original one
            const updatedCategory = { ...categoryToUpdate, name: editCategoryName };
            //categories[index].name =editCategoryName
            console.log("afte:", categories)
            console.log("handleSaveCategory: ", updateCategory)
            dispatch(updateCategory({ id: updatedCategory._id, category: updatedCategory, token }));
        }
               
        setEditCategoryId(null);
         // Re-fetch categories after adding a new one
         dispatch(getAllCategories(token));
    };

    const handleDeleteCategory = (id) => {
        console.log("handleDeleteCategory: ", id)
        dispatch(deleteCategory({ id, token: token }));
         // Re-fetch categories after adding a new one
         dispatch(getAllCategories(token));
    };

    return (
      <Box>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginTop:"10px", marginBottom:"10pxx", padding:"30px"}}>
      Categories:
      </Typography>

         <Card sx={{padding:"10px", backgroundColor: '#f0f0f0'}} variant="outlined">
        <Box sx={{ bgcolor: 'light'}}>
            {isLoading && <p>Loading...</p>}
            {isError && <p>{message}</p>}
           
            <List>
                {categories.map(category => (
                    <StyledListItem key={category._id}>
                        {editCategoryId === category._id ? (
                            <TextField
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                fullWidth
                            />
                        ) : (
                            <ListItemText primary={category.name} />
                        )}
                        {editCategoryId === category._id ? (
                            <IconButton onClick={() => handleSaveCategory(category._id)}>
                                <SaveIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={() => handleEditCategory(category._id, category.name)}>
                                <EditIcon />
                            </IconButton>
                        )}
                        <IconButton onClick={() => handleDeleteCategory(category._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </StyledListItem>
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                <TextField
                    label="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                    sx={{ flexGrow: 1 }} // {/* Allows the TextField to take up the remaining space */}
                />
                <Button
                    onClick={handleAddCategory}
                    variant="contained"
                    sx={{ whiteSpace: 'nowrap', fontSize:"15px", textTransform:'none' }} // {/* Prevents the button text from wrapping */}
                >
                    Add Category
                </Button>
          </Box>
        </Box>
        </Card>
        </Box>
    );
 
};

export default Categories;