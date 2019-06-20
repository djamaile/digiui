export default theme => ({
  root: {
    padding: theme.spacing.unit * 3
  },
  content: {
    marginTop: theme.spacing.unit * 2
  },
  progressWrapper: {
    paddingTop: '48px',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'center'
  },
  pagination: {
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  button:{
    margin: theme.spacing(1)
  },
  buttonStop:{
    margin: theme.spacing(1),
    backgroundColor:'#DC143C',
    '&hover':{
      backgroundColor:'#B22222'
    }
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
});
